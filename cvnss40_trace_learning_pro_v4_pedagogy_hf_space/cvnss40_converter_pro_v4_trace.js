/*
 * CVNSS4.0 Trace Learning Core — Pro v4 public-learning build
 * Authoring context: rewritten from the provided cvnss4.0-converter.js, preserving the
 * original converter spirit while adding a 4-lane trace layer for public online learning, separating the ambiguous P marker into its own module, and repairing QU/UY decoding collisions.
 *
 * Public API kept compatible:
 *   CVNSSConverter.convert(text, mode), CVNSSConverter.explainWord(word, mode), and CVNSSConverter.trace(text, mode).
 *   Returns: { cqn, cvn, cvss }.
 *
 * Design notes:
 *   - CQN  : Chữ Quốc Ngữ.
 *   - CVN  : Chữ Việt Nhanh, still keeps Vietnamese tone/diacritic letters after shortening.
 *   - CVSS : Chữ VN Song Song 4.0, no Vietnamese accents; KHD letters are appended.
 *   - P is NOT treated as a tone sign. It is a disambiguation marker for selected neutral
 *     shortened rimes such as logp, xajp, regp.
 */

(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.CVNSSConverter = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this), function () {
  "use strict";

  /** Initial-consonant table. Order is significant: longest and special forms first. */
  const INITIAL_ROWS = [["ngh","w"],["ng","w"],["ch","ch"],["gh","g"],["kh","k"],["nh","nh"],["ph","f"],["th","th"],["tr","tr"],["gi","j"],["qu","q"],["b","b"],["k","c"],["d","z"],["đ","d"],["g","g"],["h","h"],["c","c"],["l","l"],["m","m"],["n","n"],["r","r"],["s","s"],["t","t"],["v","v"],["x","x"]];

  /**
   * Vowel/rime table.
   * Each row is [CQN_RIME, CVSS_RIME_FROM_SPEC].
   * Some CVSS rimes in the legacy/spec table already contain final disambiguation "p".
   * During bootstrapping, PModule.extractFromTable() removes that p and records it as metadata,
   * so encoding always goes through PModule.encode().
   */
  const VOWEL_ROWS = [["a","a"],["à","al"],["ả","az"],["ã","as"],["á","aj"],["ạ","ar"],["oa","oa"],["òa","oal"],["ỏa","oaz"],["õa","oas"],["óa","oaj"],["ọa","oar"],["oà","oal"],["oả","oaz"],["oã","oas"],["oá","oaj"],["oạ","oar"],["oác","osj"],["oạc","osr"],["oách","oakj"],["oạch","oakr"],["oai","ojp"],["oài","ojl"],["oải","ojz"],["oãi","ojs"],["oái","ojj"],["oại","ojr"],["oao","owp"],["oào","owl"],["oảo","owz"],["oão","ows"],["oáo","owj"],["oạo","owr"],["oáp","ofj"],["oạp","ofr"],["oát","odj"],["oạt","odr"],["oắt","adx"],["oặt","adh"],["oắc","asx"],["oặc","ash"],["oăn","alo"],["oằn","alk"],["oẳn","alv"],["oẵn","alw"],["oắn","alx"],["oặn","alh"],["oăm","avo"],["oằm","avk"],["oẳm","avv"],["oẵm","avw"],["oắm","avx"],["oặm","avh"],["oăng","azo"],["oằng","azk"],["oẳng","azv"],["oẵng","azw"],["oắng","azx"],["oặng","azh"],["oay","ajp"],["oày","ajl"],["oảy","ajz"],["oãy","ajs"],["oáy","ajj"],["oạy","ajr"],["ác","ac"],["ạc","acr"],["ách","akj"],["ạch","akr"],["ai","ai"],["ài","ail"],["ải","aiz"],["ãi","ais"],["ái","aij"],["ại","air"],["am","am"],["àm","aml"],["ảm","amz"],["ãm","ams"],["ám","amj"],["ạm","amr"],["an","an"],["àn","anl"],["ản","anz"],["ãn","ans"],["án","anj"],["ạn","anr"],["oan","olp"],["oàn","oll"],["oản","olz"],["oãn","ols"],["oán","olj"],["oạn","olr"],["oanh","oahp"],["oành","oahl"],["oảnh","oahz"],["oãnh","oahs"],["oánh","oahj"],["oạnh","oahr"],["ang","agp"],["àng","agl"],["ảng","agz"],["ãng","ags"],["áng","agj"],["ạng","agr"],["oang","ozp"],["oàng","ozl"],["oảng","ozz"],["oãng","ozs"],["oáng","ozj"],["oạng","ozr"],["anh","ahp"],["ành","ahl"],["ảnh","ahz"],["ãnh","ahs"],["ánh","ahj"],["ạnh","ahr"],["ao","ao"],["ào","aol"],["ảo","aoz"],["ão","aos"],["áo","aoj"],["ạo","aor"],["áp","ap"],["ạp","apr"],["át","at"],["ạt","atr"],["au","au"],["àu","aul"],["ảu","auz"],["áu","auj"],["ạu","aur"],["ay","ay"],["ày","ayl"],["ảy","ayz"],["ãy","ays"],["áy","ayj"],["ạy","ayr"],["ắc","acx"],["ặc","ach"],["ăm","amo"],["ằm","amk"],["ẳm","amv"],["ẵm","amw"],["ắm","amx"],["ặm","amh"],["ăn","ano"],["ằn","ank"],["ẳn","anv"],["ẵn","anw"],["ắn","anx"],["ặn","anh"],["ăng","ago"],["ằng","agk"],["ẳng","agv"],["ẵng","agw"],["ắng","agx"],["ặng","agh"],["ắp","apx"],["ặp","aph"],["ắt","atx"],["ặt","ath"],["ấc","acb"],["ậc","acf"],["âm","amy"],["ầm","amd"],["ẩm","amq"],["ẫm","amg"],["ấm","amb"],["ậm","amf"],["ân","any"],["ần","and"],["ẩn","anq"],["ẫn","ang"],["ấn","anb"],["ận","anf"],["âng","agy"],["ầng","agd"],["ẩng","agq"],["ẫng","agg"],["ấng","agb"],["ậng","agf"],["uân","aly"],["uần","ald"],["uẩn","alq"],["uẫn","alg"],["uấn","alb"],["uận","alf"],["uâng","azy"],["uầng","azd"],["uẩng","azq"],["uẫng","azg"],["uấng","azb"],["uậng","azf"],["ấp","apb"],["ập","apf"],["ất","atb"],["ật","atf"],["uất","adb"],["uật","adf"],["âu","auy"],["ầu","aud"],["ẩu","auq"],["ẫu","aug"],["ấu","aub"],["ậu","auf"],["ây","ayy"],["ầy","ayd"],["ẩy","ayq"],["ẫy","ayg"],["ấy","ayb"],["ậy","ayf"],["uây","ajy"],["uầy","ajd"],["uẩy","ajq"],["uẫy","ajg"],["uấy","ajb"],["uậy","ajf"],["e","e"],["è","el"],["ẻ","ez"],["ẽ","es"],["é","ej"],["ẹ","er"],["oe","oe"],["òe","oel"],["ỏe","oez"],["õe","oes"],["óe","oej"],["ọe","oer"],["éc","ec"],["ẹc","ecr"],["em","em"],["èm","eml"],["ẻm","emz"],["ẽm","ems"],["ém","emj"],["ẹm","emr"],["en","en"],["èn","enl"],["ẻn","enz"],["ẽn","ens"],["én","enj"],["ẹn","enr"],["oen","elp"],["oèn","ell"],["oẻn","elz"],["oẽn","els"],["oén","elj"],["oẹn","elr"],["eng","egp"],["èng","egl"],["ẻng","egz"],["ẽng","egs"],["éng","egj"],["ẹng","egr"],["eo","eo"],["èo","eol"],["ẻo","eoz"],["ẽo","eos"],["éo","eoj"],["ẹo","eor"],["oeo","ewp"],["oèo","ewl"],["oẻo","ewz"],["oẽo","ews"],["oéo","ewj"],["oẹo","ewr"],["ép","ep"],["ẹp","epr"],["ét","et"],["ẹt","etr"],["oét","edj"],["oẹt","edr"],["ê","ey"],["ề","ed"],["ể","eq"],["ễ","eg"],["ế","eb"],["ệ","ef"],["uê","uey"],["uề","ued"],["uể","ueq"],["uễ","ueg"],["uế","ueb"],["uệ","uef"],["ếch","ekb"],["ệch","ekf"],["uếch","uekb"],["uệch","uekf"],["êm","emy"],["ềm","emd"],["ểm","emq"],["ễm","emg"],["ếm","emb"],["ệm","emf"],["ên","eny"],["ền","end"],["ển","enq"],["ễn","eng"],["ến","enb"],["ện","enf"],["ênh","ehy"],["ềnh","ehd"],["ểnh","ehq"],["ễnh","ehg"],["ếnh","ehb"],["ệnh","ehf"],["uênh","uehy"],["uềnh","uehd"],["uểnh","uehq"],["uễnh","uehg"],["uếnh","uehb"],["uệnh","uehf"],["ếp","epb"],["ệp","epf"],["ết","etb"],["ệt","etf"],["êu","euy"],["ều","eud"],["ểu","euq"],["ễu","eug"],["ếu","eub"],["ệu","euf"],["i","i"],["ì","il"],["ỉ","iz"],["ĩ","is"],["í","ij"],["ị","ir"],["uy","y"],["ùy","yl"],["ủy","yz"],["ũy","ys"],["úy","yj"],["ụy","yr"],["uỳ","yl"],["uỷ","yz"],["uỹ","ys"],["uý","yj"],["uỵ","yr"],["ia","ia"],["ìa","ial"],["ỉa","iaz"],["ĩa","ias"],["ía","iaj"],["ịa","iar"],["uya","ya"],["íc","ic"],["ích","ikj"],["ịch","ikr"],["uých","ykj"],["uỵch","ykr"],["iếc","isb"],["iệc","isf"],["iêm","ivy"],["iềm","ivd"],["iểm","ivq"],["iễm","ivg"],["iếm","ivb"],["iệm","ivf"],["iên","ily"],["iền","ild"],["iển","ilq"],["iễn","ilg"],["iến","ilb"],["iện","ilf"],["uyên","yly"],["uyền","yld"],["uyển","ylq"],["uyễn","ylg"],["uyến","ylb"],["uyện","ylf"],["iêng","izy"],["iềng","izd"],["iểng","izq"],["iễng","izg"],["iếng","izb"],["iệng","izf"],["iếp","ifb"],["iệp","iff"],["iết","idb"],["iệt","idf"],["uyết","ydb"],["uyệt","ydf"],["iêu","iwy"],["iều","iwd"],["iểu","iwq"],["iễu","iwg"],["iếu","iwb"],["iệu","iwf"],["yêt","idb"],["yệt","idf"],["yên","ily"],["yền","ild"],["yển","ilq"],["yễn","ilg"],["yến","ilb"],["yện","ilf"],["yêm","ivy"],["yềm","ivd"],["yểm","ivq"],["yễm","ivg"],["yếm","ivb"],["yệm","ivf"],["yêng","izy"],["yềng","izd"],["yểng","izq"],["yễng","izg"],["yếng","izb"],["yệnh","izf"],["yêu","iwy"],["yều","iwd"],["yểu","iwq"],["yễu","iwg"],["yếu","iwb"],["yệu","iwf"],["im","im"],["ìm","iml"],["ỉm","imz"],["ĩm","ims"],["ím","imj"],["ịm","imr"],["in","in"],["ìn","inl"],["ỉn","inz"],["ĩn","ins"],["ín","inj"],["ịn","inr"],["inh","ihp"],["ình","ihl"],["ỉnh","ihz"],["ĩnh","ihs"],["ính","ihj"],["ịnh","ihr"],["uynh","yhp"],["uỳnh","yhl"],["uỷnh","yhz"],["uỹnh","yhs"],["uýnh","yhj"],["uỵnh","yhr"],["íp","ip"],["ịp","ipr"],["uýp","yp"],["uỵp","ypr"],["ít","it"],["ịt","itr"],["uýt","yt"],["uỵt","ytr"],["iu","iu"],["ìu","iul"],["ỉu","iuz"],["ĩu","ius"],["íu","iuj"],["ịu","iur"],["uyu","yu"],["uỳu","yul"],["uỷu","yuz"],["uỹu","yus"],["uýu","yuj"],["uỵu","yur"],["uỳn","ynl"],["uỷn","ynz"],["uỹn","yns"],["uýn","ynj"],["uỵn","ynr"],["o","o"],["ò","ol"],["ỏ","oz"],["õ","os"],["ó","oj"],["ọ","or"],["óc","oc"],["ọc","ocr"],["oi","oi"],["òi","oil"],["ỏi","oiz"],["õi","ois"],["ói","oij"],["ọi","oir"],["om","om"],["òm","oml"],["ỏm","omz"],["õm","oms"],["óm","omj"],["ọm","omr"],["on","on"],["òn","onl"],["ỏn","onz"],["õn","ons"],["ón","onj"],["ọn","onr"],["ong","ogp"],["òng","ogl"],["ỏng","ogz"],["õng","ogs"],["óng","ogj"],["ọng","ogr"],["oóc","ooc"],["oong","oog"],["oòng","oogl"],["oỏng","oogz"],["oõng","oogs"],["oóng","oogj"],["oòng","oogl"],["oọng","oogr"],["óp","op"],["ọp","opr"],["ót","ot"],["ọt","otr"],["ô","oy"],["ồ","od"],["ổ","oq"],["ỗ","og"],["ố","ob"],["ộ","of"],["ốc","ocb"],["ộc","ocf"],["ôi","oiy"],["ồi","oid"],["ổi","oiq"],["ỗi","oig"],["ối","oib"],["ội","oif"],["ôm","omy"],["ồm","omd"],["ổm","omq"],["ỗm","omg"],["ốm","omb"],["ộm","omf"],["ôn","ony"],["ồn","ond"],["ổn","onq"],["ỗn","ong"],["ốn","onb"],["ộn","onf"],["ông","ogy"],["ồng","ogd"],["ổng","ogq"],["ỗng","ogg"],["ống","ogb"],["ộng","ogf"],["ốp","opb"],["ộp","opf"],["ốt","otb"],["ột","otf"],["ơ","oo"],["ờ","ok"],["ở","ov"],["ỡ","ow"],["ớ","ox"],["ợ","oh"],["ơi","oio"],["ời","oik"],["ởi","oiv"],["ỡi","oiw"],["ới","oix"],["ợi","oih"],["ơm","omo"],["ờm","omk"],["ởm","omv"],["ỡm","omw"],["ớm","omx"],["ợm","omh"],["ơn","ono"],["ờn","onk"],["ởn","onv"],["ỡn","onw"],["ớn","onx"],["ợn","onh"],["ơng","ogo"],["ờng","ogk"],["ởng","ogv"],["ỡng","ogw"],["ớng","ogx"],["ợng","ogh"],["ớp","opx"],["ợp","oph"],["ớt","otx"],["ợt","oth"],["u","u"],["ù","ul"],["ủ","uz"],["ũ","us"],["ú","uj"],["ụ","ur"],["ua","ua"],["ùa","ual"],["ủa","uaz"],["ũa","uas"],["úa","uaj"],["ụa","uar"],["úc","uc"],["ục","ucr"],["ui","ui"],["ùi","uil"],["ủi","uiz"],["ũi","uis"],["úi","uij"],["ụi","uir"],["um","um"],["ùm","uml"],["ủm","umz"],["ũm","ums"],["úm","umj"],["ụm","umr"],["un","un"],["ùn","unl"],["ủn","unz"],["ũn","uns"],["ún","unj"],["ụn","unr"],["ung","ugp"],["ùng","ugl"],["ủng","ugz"],["ũng","ugs"],["úng","ugj"],["ụng","ugr"],["uơ","uoo"],["uờ","uok"],["uở","uov"],["uỡ","uow"],["uớ","uox"],["uợ","uoh"],["uơn","olo"],["uờn","olk"],["uởn","olv"],["uỡn","olw"],["uớn","olx"],["uợn","olh"],["uớt","odx"],["uợt","odh"],["uốc","usb"],["uộc","usf"],["uôi","ujy"],["uồi","ujd"],["uổi","ujq"],["uỗi","ujg"],["uối","ujb"],["uội","ujf"],["uôm","uvy"],["uồm","uvd"],["uổm","uvq"],["uỗm","uvg"],["uốm","uvb"],["uộm","uvf"],["uôn","uly"],["uồn","uld"],["uổn","ulq"],["uỗn","ulg"],["uốn","ulb"],["uộn","ulf"],["uông","uzy"],["uồng","uzd"],["uổng","uzq"],["uỗng","uzg"],["uống","uzb"],["uộng","uzf"],["uốt","udb"],["uột","udf"],["uốp","ufb"],["uộp","uff"],["úp","up"],["ụp","upr"],["út","ut"],["ụt","utr"],["ư","uo"],["ừ","uk"],["ử","uv"],["ữ","uw"],["ứ","ux"],["ự","uh"],["ưa","uao"],["ừa","uak"],["ửa","uav"],["ữa","uaw"],["ứa","uax"],["ựa","uah"],["ức","ucx"],["ực","uch"],["ưi","uio"],["ừi","uik"],["ửi","uiv"],["ữi","uiw"],["ứi","uix"],["ựi","uih"],["ưm","umo"],["ừm","umk"],["ửm","umv"],["ữm","umw"],["ứm","umx"],["ựm","umh"],["ưn","uno"],["ừn","unk"],["ửn","unv"],["ữn","unw"],["ứn","unx"],["ựn","unh"],["ưng","ugo"],["ừng","ugk"],["ửng","ugv"],["ững","ugw"],["ứng","ugx"],["ựng","ugh"],["ước","usx"],["ược","ush"],["ươi","ujo"],["ười","ujk"],["ưởi","ujv"],["ưỡi","ujw"],["ưới","ujx"],["ượi","ujh"],["ươm","uvo"],["ườm","uvk"],["ưởm","uvv"],["ưỡm","uvw"],["ướm","uvx"],["ượm","uvh"],["ươn","ulo"],["ườn","ulk"],["ưởn","ulv"],["ưỡn","ulw"],["ướn","ulx"],["ượn","ulh"],["ương","uzo"],["ường","uzk"],["ưởng","uzv"],["ưỡng","uzw"],["ướng","uzx"],["ượng","uzh"],["ướp","ufx"],["ượp","ufh"],["ướt","udx"],["ượt","udh"],["ươu","uwo"],["ườu","uwk"],["ưởu","uwv"],["ưỡu","uww"],["ướu","uwx"],["ượu","uwh"],["ứt","utx"],["ựt","uth"],["ưu","uuo"],["ừu","uuk"],["ửu","uuv"],["ữu","uuw"],["ứu","uux"],["ựu","uuh"],["y","i"],["ỳ","il"],["ỷ","iz"],["ỹ","is"],["ý","ij"],["ỵ","ir"],["ỳa","ial"],["ỷa","iaz"],["ỹa","ias"],["ýa","iaj"],["ỵa","iar"]];

  /** Compatibility export: original separator list. Tokenisation below is Unicode-based. */
  const specialChars = ["`","“","”","<",">","@","-",";","=","…"," ",",",".","?","!","\"","'","(",")","[","]","{","}","%","#","$","&","_","\\","/","*",":","+","~","^","|","\r\n","\r","\n"];

  /** Vowel groups used for base-vowel lookup. */
  const BASE_VOWEL_GROUPS = ["aàảãáạ","ăằẳẵắặ","âầẩẫấậ","eèẻẽéẹ","êềểễếệ","iìỉĩíị","oòỏõóọ","ôồổỗốộ","ơờởỡớợ","uùủũúụ","ưừửữứự","yỳỷỹýỵ"];

  /** Tone and vowel utilities for generating true CVN from CQN. */
  const TONE_NAMES = ["none", "grave", "hook", "tilde", "acute", "dot"];
  const VOWEL_FORMS = {
    "a": ["a", "à", "ả", "ã", "á", "ạ"],
    "ă": ["ă", "ằ", "ẳ", "ẵ", "ắ", "ặ"],
    "â": ["â", "ầ", "ẩ", "ẫ", "ấ", "ậ"],
    "e": ["e", "è", "ẻ", "ẽ", "é", "ẹ"],
    "ê": ["ê", "ề", "ể", "ễ", "ế", "ệ"],
    "i": ["i", "ì", "ỉ", "ĩ", "í", "ị"],
    "o": ["o", "ò", "ỏ", "õ", "ó", "ọ"],
    "ô": ["ô", "ồ", "ổ", "ỗ", "ố", "ộ"],
    "ơ": ["ơ", "ờ", "ở", "ỡ", "ớ", "ợ"],
    "u": ["u", "ù", "ủ", "ũ", "ú", "ụ"],
    "ư": ["ư", "ừ", "ử", "ữ", "ứ", "ự"],
    "y": ["y", "ỳ", "ỷ", "ỹ", "ý", "ỵ"]
  };

  const CHAR_INFO = new Map();
  for (const [base, forms] of Object.entries(VOWEL_FORMS)) {
    forms.forEach((ch, index) => CHAR_INFO.set(ch, { base, tone: TONE_NAMES[index] }));
  }

  /**
   * P marker module.
   * P only marks selected rimes that are neutral tone and have no circumflex/breve/horn KHD.
   * It prevents collisions such as logp = long while log = lỗ; xajp = xoay while xaj = xá.
   */
  const PModule = Object.freeze({
    endings: Object.freeze(["ag", "ah", "aj", "eg", "el", "ev", "ew", "ez", "ih", "oah", "og", "oj", "ol", "ov", "ow", "oz", "ug", "yh"]),

    isProtectedCore(core) {
      return this.endings.includes(core);
    },

    extractFromTable(cvssRime) {
      if (typeof cvssRime !== "string" || !cvssRime.endsWith("p")) {
        return { core: cvssRime, needsP: false };
      }
      const core = cvssRime.slice(0, -1);
      return this.isProtectedCore(core)
        ? { core, needsP: true }
        : { core: cvssRime, needsP: false };
    },

    encode(core, needsP) {
      return needsP ? core + "p" : core;
    },

    decode(cvssRime) {
      if (typeof cvssRime !== "string" || !cvssRime.endsWith("p")) {
        return { core: cvssRime, hadP: false };
      }
      const core = cvssRime.slice(0, -1);
      return this.isProtectedCore(core)
        ? { core, hadP: true }
        : { core: cvssRime, hadP: false };
    }
  });

  const Maps = buildMaps();

  function buildMaps() {
    const cqnInitialToCvn = new Map(INITIAL_ROWS.map(([cqn, cvn]) => [cqn, cvn]));
    const cvnInitialToCqn = new Map();
    for (const [cqn, cvn] of INITIAL_ROWS) {
      if (!cvnInitialToCqn.has(cvn)) cvnInitialToCqn.set(cvn, cqn);
    }

    const cqnVowelToEntry = new Map();
    const cvssVowelToCqn = new Map();
    const cvssPVowelToCqn = new Map();
    const cvnVowelToCqn = new Map();

    for (const [cqn, cvssFromTable] of VOWEL_ROWS) {
      const pInfo = PModule.extractFromTable(cvssFromTable);
      const entry = Object.freeze({
        cqn,
        cvn: cqnRimeToCvn(cqn),
        cvssCore: pInfo.core,
        needsP: pInfo.needsP
      });

      if (!cqnVowelToEntry.has(cqn)) cqnVowelToEntry.set(cqn, entry);
      if (!cvnVowelToCqn.has(entry.cvn)) cvnVowelToCqn.set(entry.cvn, cqn);

      if (entry.needsP) {
        if (!cvssPVowelToCqn.has(entry.cvssCore)) cvssPVowelToCqn.set(entry.cvssCore, cqn);
      } else {
        if (!cvssVowelToCqn.has(entry.cvssCore)) cvssVowelToCqn.set(entry.cvssCore, cqn);
      }
    }

    return Object.freeze({
      cqnInitialToCvn,
      cvnInitialToCqn,
      cqnVowelToEntry,
      cvssVowelToCqn,
      cvssPVowelToCqn,
      cvnVowelToCqn
    });
  }

  function getBaseVowel(ch) {
    if (!ch) return "";
    const info = CHAR_INFO.get(ch);
    if (info) return info.base;
    for (const group of BASE_VOWEL_GROUPS) {
      if (group.includes(ch)) return group[0];
    }
    return ch;
  }

  function getTone(str) {
    for (const ch of str) {
      const info = CHAR_INFO.get(ch);
      if (info && info.tone !== "none") return info.tone;
    }
    return "none";
  }

  function stripTone(str) {
    let out = "";
    for (const ch of str) {
      const info = CHAR_INFO.get(ch);
      out += info ? VOWEL_FORMS[info.base][0] : ch;
    }
    return out;
  }

  function applyToneToFirstVowel(str, tone) {
    if (tone === "none") return str;
    const toneIndex = TONE_NAMES.indexOf(tone);
    if (toneIndex < 0) return str;
    let out = "";
    let applied = false;
    for (const ch of str) {
      if (!applied && Object.prototype.hasOwnProperty.call(VOWEL_FORMS, ch)) {
        out += VOWEL_FORMS[ch][toneIndex];
        applied = true;
      } else {
        out += ch;
      }
    }
    return out;
  }

  function reduceFinalConsonant(cvnRime) {
    if (cvnRime.endsWith("ng")) return cvnRime.slice(0, -2) + "g";
    if (cvnRime.endsWith("nh")) return cvnRime.slice(0, -2) + "h";
    if (cvnRime.endsWith("ch")) return cvnRime.slice(0, -2) + "k";
    return cvnRime;
  }

  /** Generate true CVN from a CQN rime. CVN keeps Vietnamese tone/diacritic letters. */
  function cqnRimeToCvn(cqnRime) {
    const rime = String(cqnRime || "").toLowerCase().normalize("NFC");
    if (!rime) return rime;

    const tone = getTone(rime);
    const noTone = stripTone(rime);
    const toneForCvn = tone === "acute" && /[cpt]$/.test(noTone) ? "none" : tone;

    const longPrefixRules = [
      ["uyê", "y"], ["iê", "i"], ["yê", "i"], ["uô", "u"], ["ươ", "ư"],
      ["uâ", "â"], ["uơ", "ơ"], ["oă", "ă"], ["oe", "e"], ["oa", "o"]
    ];
    const longFinalRules = [
      ["ng", "z"], ["t", "d"], ["p", "f"], ["c", "s"], ["n", "l"],
      ["m", "v"], ["o", "w"], ["u", "w"], ["i", "j"], ["y", "j"]
    ];

    for (const [prefix, reducedVowel0] of longPrefixRules) {
      if (!noTone.startsWith(prefix)) continue;
      const rest = noTone.slice(prefix.length);
      let reducedVowel = prefix === "oa" && rest === "y" ? "a" : reducedVowel0;
      for (const [tail, code] of longFinalRules) {
        if (rest === tail) return applyToneToFirstVowel(reducedVowel, toneForCvn) + code;
      }
    }

    // Y -> I; UY -> Y; AY/ÂY are naturally preserved because they do not start with UY.
    if (noTone.startsWith("uy")) {
      return reduceFinalConsonant(applyToneToFirstVowel("y", toneForCvn) + noTone.slice(2));
    }
    if (noTone.startsWith("y")) {
      return reduceFinalConsonant(applyToneToFirstVowel("i", toneForCvn) + noTone.slice(1));
    }

    return reduceFinalConsonant(applyToneToFirstVowel(noTone, toneForCvn));
  }

  /**
   * Tokeniser written without Unicode property escapes (\p{L}) to avoid syntax errors
   * in older browsers / constrained WebView runtimes. Vietnamese precomposed letters
   * are covered by Latin-1, Latin Extended and Latin Extended Additional ranges.
   */
  function isAsciiDigitCode(code) {
    return code >= 48 && code <= 57;
  }

  function isAsciiLetterCode(code) {
    return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
  }

  function isVietnameseLetterChar(ch) {
    if (!ch) return false;
    const code = ch.charCodeAt(0);
    return isAsciiLetterCode(code) ||
      ch === "đ" || ch === "Đ" ||
      (code >= 0x00C0 && code <= 0x024F) ||
      (code >= 0x1E00 && code <= 0x1EFF);
  }

  function isWordChar(ch) {
    if (!ch) return false;
    const code = ch.charCodeAt(0);
    return isAsciiDigitCode(code) || isVietnameseLetterChar(ch);
  }

  function tokenize(input) {
    const text = String(input == null ? "" : input).normalize("NFC");
    const tokens = [];
    let buffer = "";
    let previousIsWord = null;

    for (const ch of Array.from(text)) {
      const currentIsWord = isWordChar(ch);
      if (previousIsWord === null || previousIsWord === currentIsWord) {
        buffer += ch;
      } else {
        if (buffer) tokens.push(buffer);
        buffer = ch;
      }
      previousIsWord = currentIsWord;
    }

    if (buffer) tokens.push(buffer);
    return tokens;
  }

  function hasLetter(token) {
    for (const ch of Array.from(String(token || ""))) {
      if (isVietnameseLetterChar(ch)) return true;
    }
    return false;
  }

  function splitInitial(word, source) {
    const rows = source === "cqn" ? INITIAL_ROWS : INITIAL_ROWS.map(([cqn, cvn]) => [cvn, cqn]);
    for (const [head, back] of rows) {
      if (head && word.startsWith(head)) return { head, back, tail: word.slice(head.length) };
    }
    return { head: "", back: "", tail: word };
  }

  function restoreCase(original, converted) {
    if (!converted) return converted;
    const letters = Array.from(original).filter(ch => ch.toLowerCase() !== ch.toUpperCase());
    const isUpper = letters.length > 0 && letters.every(ch => ch === ch.toUpperCase());
    if (isUpper) return converted.toUpperCase();
    if (original[0] && original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
      return converted[0].toUpperCase() + converted.slice(1);
    }
    return converted;
  }

  /**
   * Canonicalise UY rimes after Q/QU during reverse conversion.
   *
   * CVNSS tables may contain both historical spellings such as "ủy" and "uỷ"
   * mapping to the same CVSS code (e.g. yz). For standalone syllables, "ủy"
   * is acceptable; after Q/QU, Vietnamese orthography expects the tone to sit
   * on the Y-family letter: q + uỷ = quỷ, not q + ủy = qủy.
   */
  function canonicalizeUyAfterQ(rime) {
    const replacements = [
      ["ùy", "uỳ"],
      ["ủy", "uỷ"],
      ["ũy", "uỹ"],
      ["úy", "uý"],
      ["ụy", "uỵ"]
    ];
    for (const [from, to] of replacements) {
      if (rime.startsWith(from)) return to + rime.slice(from.length);
    }
    return rime;
  }

  /**
   * Repair a decoded CQN initial/rime pair.
   * Returns both parts because QU/UY may need to adjust the initial and rime
   * together. This fixes cases like qyz -> quỷ and qyj -> quý.
   */
  function repairDecodedCqnParts(cqnInitial, cqnRime) {
    const firstBase = getBaseVowel(cqnRime[0] || "");
    let head = cqnInitial;
    let tail = cqnRime;

    // QU in CVN/CVSS is encoded as Q. If the decoded rime already begins with U,
    // write the output as q + canonical UY-family material to avoid double U.
    if (head === "qu" && firstBase === "u") {
      head = "q";
      tail = canonicalizeUyAfterQ(tail);
    }

    // J + iêng/iên/... represents GI without duplicating i: g + iêng = giêng.
    if (head === "gi" && firstBase === "i") head = "g";

    // Orthographic repair: ngh/gh/k only before i/e/ê. Else use ng/g/c.
    if (["ngh", "gh", "k"].includes(head) && !"ieê".includes(firstBase)) {
      head = { ngh: "ng", gh: "g", k: "c" }[head];
    }

    return { head, tail };
  }

  function adjustCqnInitialForVowel(cqnInitial, cqnRime) {
    return repairDecodedCqnParts(cqnInitial, cqnRime).head;
  }

  function toCvssFromEntry(entry) {
    return PModule.encode(entry.cvssCore, entry.needsP);
  }

  function convertCqnWord(word) {
    const lower = word.toLowerCase().normalize("NFC");
    const originalLower = lower;
    let { head: cqnInitial, tail: cqnRime } = splitInitial(lower, "cqn");

    // Original core compatibility rules.
    if (cqnInitial === "gi" && cqnRime !== "a" && Maps.cqnVowelToEntry.has("i" + cqnRime)) {
      cqnRime = "i" + cqnRime;
    }
    if (cqnInitial === "qu" && getBaseVowel(cqnRime[0]) === "y") {
      cqnRime = "u" + cqnRime;
    }
    if (cqnInitial === "g" && getBaseVowel(cqnRime[0]) === "i") {
      cqnInitial = "gi";
    }

    const cvnInitial = Maps.cqnInitialToCvn.get(cqnInitial) ?? cqnInitial;
    const entry = Maps.cqnVowelToEntry.get(cqnRime);

    const cqn = originalLower;
    const cvn = cvnInitial + (entry ? entry.cvn : cqnRimeToCvn(cqnRime));
    const cvss = cvnInitial + (entry ? toCvssFromEntry(entry) : cqnRime);

    return {
      cqn: restoreCase(word, cqn),
      cvn: restoreCase(word, cvn),
      cvss: restoreCase(word, cvss)
    };
  }

  function convertCvnWord(word) {
    const lower = word.toLowerCase().normalize("NFC");
    const split = splitInitial(lower, "cvn");
    let cqnInitial = Maps.cvnInitialToCqn.get(split.head) ?? split.back ?? split.head;
    const cqnRime = Maps.cvnVowelToCqn.get(split.tail) ?? split.tail;
    const repaired = repairDecodedCqnParts(cqnInitial, cqnRime);

    const cqn = repaired.head + repaired.tail;
    const fromCqn = convertCqnWord(cqn);
    return {
      cqn: restoreCase(word, cqn),
      cvn: restoreCase(word, lower),
      cvss: restoreCase(word, fromCqn.cvss.toLowerCase())
    };
  }

  function convertCvssWord(word) {
    const lower = word.toLowerCase().normalize("NFC");
    const split = splitInitial(lower, "cvn");
    let cqnInitial = Maps.cvnInitialToCqn.get(split.head) ?? split.back ?? split.head;

    const pDecoded = PModule.decode(split.tail);
    let cqnRime;
    if (pDecoded.hadP && Maps.cvssPVowelToCqn.has(pDecoded.core)) {
      cqnRime = Maps.cvssPVowelToCqn.get(pDecoded.core);
    } else {
      cqnRime = Maps.cvssVowelToCqn.get(split.tail) ?? Maps.cvssVowelToCqn.get(pDecoded.core) ?? split.tail;
    }

    const repaired = repairDecodedCqnParts(cqnInitial, cqnRime);
    const cqn = repaired.head + repaired.tail;
    const fromCqn = convertCqnWord(cqn);

    return {
      cqn: restoreCase(word, cqn),
      cvn: restoreCase(word, fromCqn.cvn.toLowerCase()),
      cvss: restoreCase(word, lower)
    };
  }

  function convertWord(word, mode = "cqn") {
    if (!hasLetter(word)) return { cqn: word, cvn: word, cvss: word };
    if (mode === "cqn") return convertCqnWord(word);
    if (mode === "cvn") return convertCvnWord(word);
    if (mode === "cvss" || mode === "cvnss") return convertCvssWord(word);
    throw new Error('Unsupported CVNSSConverter mode: ' + mode + '. Use "cqn", "cvn", or "cvss".');
  }

  function convertText(input, mode = "cqn") {
    const result = { cqn: [], cvn: [], cvss: [] };
    for (const token of tokenize(input)) {
      const converted = convertWord(token, mode);
      result.cqn.push(converted.cqn);
      result.cvn.push(converted.cvn);
      result.cvss.push(converted.cvss);
    }
    return {
      cqn: result.cqn.join(""),
      cvn: result.cvn.join(""),
      cvss: result.cvss.join("")
    };
  }


  const TRACE_TONE_LABEL = Object.freeze({
    none: "thanh ngang", grave: "huyền", hook: "hỏi", tilde: "ngã", acute: "sắc", dot: "nặng"
  });
  const TRACE_KHD_TABLE = Object.freeze({
    circumflex: { acute:["B","nón + sắc"], grave:["D","nón + huyền"], hook:["Q","nón + hỏi"], tilde:["G","nón + ngã"], dot:["F","nón + nặng"], none:["Y","nón + thanh ngang"] },
    hook: { acute:["X","móc/trăng + sắc"], grave:["K","móc/trăng + huyền"], hook:["V","móc/trăng + hỏi"], tilde:["W","móc/trăng + ngã"], dot:["H","móc/trăng + nặng"], none:["O","móc/trăng + thanh ngang"] },
    plain: { acute:["J","trơn + sắc"], grave:["L","trơn + huyền"], hook:["Z","trơn + hỏi"], tilde:["S","trơn + ngã"], dot:["R","trơn + nặng"], none:["","thanh ngang không dấu phụ"] }
  });

  function traceVowelFamily(cqnRime) {
    const stripped = stripTone(String(cqnRime || ""));
    if (/[âêô]/.test(stripped)) return "circumflex";
    if (/[ăơư]/.test(stripped)) return "hook";
    return "plain";
  }

  function traceKhdInfo(cqnRime, cvssRime) {
    const tone = getTone(cqnRime);
    const family = traceVowelFamily(cqnRime);
    const noTone = stripTone(cqnRime);
    let pInfo = PModule.decode(cvssRime || "");
    let marker = "";
    let label = "không cần KHD";
    let note = "Không có dấu phụ/dấu thanh phải mã hóa riêng.";

    if (tone === "acute" && family === "plain" && /[cpt]$/.test(noTone)) {
      marker = "∅";
      label = "bỏ J vì sắc + cuối c/p/t";
      note = "Theo quy tắc CVN: các, úp, hát không thêm J để giữ ngắn.";
    } else {
      const cell = TRACE_KHD_TABLE[family] && TRACE_KHD_TABLE[family][tone];
      if (cell) {
        marker = cell[0] || "∅";
        label = cell[1];
        if (marker) note = "KHD dự kiến: " + marker + " (" + label + ").";
        else note = "Thanh ngang trơn: không cần KHD, chỉ kiểm tra P nếu vần thuộc danh mục.";
      }
    }
    return { tone, toneLabel: TRACE_TONE_LABEL[tone] || tone, family, marker, label, note, hasP: pInfo.hadP, pCore: pInfo.core };
  }

  function traceInitialRule(cqnInitial, cvnInitial) {
    if (!cqnInitial) return "Không có phụ âm đầu.";
    if (cqnInitial === cvnInitial) return "Phụ âm đầu giữ nguyên: " + cqnInitial + ".";
    return "Phụ âm đầu: " + cqnInitial.toUpperCase() + " → " + cvnInitial.toUpperCase() + ".";
  }

  function traceSplitCqnWord(word) {
    const lower = String(word || "").toLowerCase().normalize("NFC");
    let split = splitInitial(lower, "cqn");
    let cqnInitial = split.head;
    let cqnRime = split.tail;
    const compatibility = [];
    if (cqnInitial === "gi" && cqnRime !== "a" && Maps.cqnVowelToEntry.has("i" + cqnRime)) {
      cqnRime = "i" + cqnRime;
      compatibility.push("GI + vần i được nhập vào phần vần để tra bảng ổn định.");
    }
    if (cqnInitial === "qu" && getBaseVowel(cqnRime[0]) === "y") {
      cqnRime = "u" + cqnRime;
      compatibility.push("QU + Y được chuẩn hóa thành Q + UY để mã hóa UY → Y.");
    }
    if (cqnInitial === "g" && getBaseVowel(cqnRime[0]) === "i") {
      cqnInitial = "gi";
      compatibility.push("G trước I được phục hồi dạng GI trong CQN.");
    }
    return { lower, cqnInitial, cqnRime, compatibility };
  }

  function explainCqnWord(word) {
    const converted = convertCqnWord(word);
    const split = traceSplitCqnWord(word);
    const cvnInitial = Maps.cqnInitialToCvn.get(split.cqnInitial) ?? split.cqnInitial;
    const entry = Maps.cqnVowelToEntry.get(split.cqnRime);
    const cvnRime = entry ? entry.cvn : cqnRimeToCvn(split.cqnRime);
    const cvssRime = entry ? PModule.encode(entry.cvssCore, entry.needsP) : split.cqnRime;
    const pDecoded = PModule.decode(cvssRime);
    const khd = traceKhdInfo(split.cqnRime, cvssRime);
    const lane3Value = pDecoded.hadP ? pDecoded.core : cvssRime;
    const pText = pDecoded.hadP
      ? "Có P: lõi “" + pDecoded.core + "” thuộc danh mục P, thêm P để chống nhập nhằng."
      : "Không thêm P: vần không thuộc điều kiện P hoặc đã có KHD/dấu thanh.";
    return {
      token: word, mode: "cqn", direction: "CQN → CVNSS4.0", result: converted,
      parts: { cqnInitial: split.cqnInitial, cqnRime: split.cqnRime, cvnInitial, cvnRime, cvssRime },
      lanes: [
        { id: 1, key: "cqn", title: "Làn 1 — CQN nguồn", value: split.lower, explanation: "Tách từ thành phụ âm đầu “" + (split.cqnInitial || "∅") + "” và phần vần “" + split.cqnRime + "”.", rules: split.compatibility },
        { id: 2, key: "cvn", title: "Làn 2 — CVN rút gọn", value: converted.cvn, explanation: traceInitialRule(split.cqnInitial, cvnInitial) + " Phần vần: “" + split.cqnRime + "” → “" + cvnRime + "”.", rules: ["Áp dụng nhóm CVN: đổi phụ âm đầu/cuối, Y/UY, 56 vần dài, bỏ sắc ở c/p/t nếu có."] },
        { id: 3, key: "khd", title: "Làn 3 — KHD / CVSS lõi", value: lane3Value, explanation: khd.note, rules: ["Thanh: " + khd.toneLabel, "Nhóm dấu: " + khd.family, "KHD: " + (khd.marker || "∅") + " — " + khd.label] },
        { id: 4, key: "p", title: "Làn 4 — P chống nhập nhằng", value: pDecoded.hadP ? "P" : "∅", explanation: pText, rules: ["Danh mục P: " + PModule.endings.join(", ")] }
      ],
      summary: "“" + word + "” → CVN “" + converted.cvn + "” → CVNSS4.0 “" + converted.cvss + "”."
    };
  }

  function explainCvssWord(word) {
    const converted = convertCvssWord(word);
    const lower = String(word || "").toLowerCase().normalize("NFC");
    const split = splitInitial(lower, "cvn");
    const pDecoded = PModule.decode(split.tail);
    let cqnInitial = Maps.cvnInitialToCqn.get(split.head) ?? split.back ?? split.head;
    let cqnRime = pDecoded.hadP && Maps.cvssPVowelToCqn.has(pDecoded.core)
      ? Maps.cvssPVowelToCqn.get(pDecoded.core)
      : (Maps.cvssVowelToCqn.get(split.tail) ?? Maps.cvssVowelToCqn.get(pDecoded.core) ?? split.tail);
    const repaired = repairDecodedCqnParts(cqnInitial, cqnRime);
    cqnInitial = repaired.head; cqnRime = repaired.tail;
    const khd = traceKhdInfo(cqnRime, split.tail);
    return {
      token: word, mode: "cvss", direction: "CVNSS4.0 → CQN", result: converted,
      parts: { cvssInitial: split.head, cvssRime: split.tail, pCore: pDecoded.core, cqnInitial, cqnRime },
      lanes: [
        { id: 1, key: "cvss", title: "Làn 1 — CVNSS nguồn", value: lower, explanation: "Tách mã thành đầu “" + (split.head || "∅") + "” và đuôi “" + split.tail + "”.", rules: [] },
        { id: 2, key: "p", title: "Làn 2 — Kiểm tra P", value: pDecoded.hadP ? "P" : "∅", explanation: pDecoded.hadP ? "Loại P câm để lấy lõi “" + pDecoded.core + "” trước khi giải mã." : "Không có P câm hoặc P không thuộc danh mục bảo vệ.", rules: ["P không phải dấu thanh; P chỉ chống nhập nhằng."] },
        { id: 3, key: "khd", title: "Làn 3 — Giải KHD", value: cqnRime, explanation: "Nhận diện KHD: " + (khd.marker || "∅") + " — " + khd.label + ".", rules: ["Thanh: " + khd.toneLabel, "Nhóm dấu: " + khd.family] },
        { id: 4, key: "cqn", title: "Làn 4 — Phục hồi CQN/CVN", value: converted.cqn, explanation: "Phục hồi phụ âm/vần và sửa chính tả QU/UY, GH/NGH/K nếu cần.", rules: ["CQN: " + converted.cqn, "CVN: " + converted.cvn] }
      ],
      summary: "“" + word + "” → CQN “" + converted.cqn + "”, CVN “" + converted.cvn + "”."
    };
  }

  function explainCvnWord(word) {
    const converted = convertCvnWord(word);
    const fromCqn = explainCqnWord(converted.cqn);
    fromCqn.token = word;
    fromCqn.mode = "cvn";
    fromCqn.direction = "CVN → CQN/CVNSS4.0";
    fromCqn.summary = "“" + word + "” được hiểu là CVN; phục hồi CQN “" + converted.cqn + "” và CVNSS4.0 “" + converted.cvss + "”.";
    fromCqn.result = converted;
    return fromCqn;
  }

  function explainWord(word, mode = "cqn") {
    if (!hasLetter(word)) {
      return { token: word, mode, direction: "non-word", result: { cqn: word, cvn: word, cvss: word }, lanes: [], summary: "Không phải token chữ; giữ nguyên." };
    }
    if (mode === "cqn") return explainCqnWord(word);
    if (mode === "cvn") return explainCvnWord(word);
    if (mode === "cvss" || mode === "cvnss") return explainCvssWord(word);
    throw new Error('Unsupported CVNSSConverter explain mode: ' + mode + '. Use "cqn", "cvn", or "cvss".');
  }

  function trace(input, mode = "cqn") {
    return tokenize(input).map(token => explainWord(token, mode));
  }

  function selfTest() {
    const cases = [
      ["cqn", "long", "cvss", "logp"],
      ["cqn", "lỗ", "cvss", "log"],
      ["cqn", "xoay", "cvss", "xajp"],
      ["cqn", "reng", "cvss", "regp"],
      ["cvss", "logp", "cqn", "long"],
      ["cvss", "log", "cqn", "lỗ"],
      ["cqn", "tuyết", "cvn", "tyd"],
      ["cqn", "nguyễn", "cvn", "wỹl"],
      ["cqn", "tuyết", "cvss", "tydb"],
      ["cqn", "nguyễn", "cvss", "wylg"],
      ["cqn", "quỷ", "cvss", "qyz"],
      ["cvss", "qyz", "cqn", "quỷ"],
      ["cvss", "qyj", "cqn", "quý"],
      ["cvss", "qyld", "cqn", "quyền"],
      ["cvss", "qyt", "cqn", "quýt"],
      ["cqn", "thúy", "cvss", "thyj"],
      ["cvss", "thyj", "cqn", "thúy"]
    ];
    return cases.map(([mode, input, field, expected]) => {
      const actual = convertText(input, mode)[field];
      return { mode, input, field, expected, actual, ok: actual === expected };
    });
  }

  return Object.freeze({
    convert: convertText,
    convertWord,
    explainWord,
    trace,
    cqnRimeToCvn,
    repairDecodedCqnParts,
    canonicalizeUyAfterQ,
    PModule,
    specialChars,
    data: Object.freeze({
      initials: INITIAL_ROWS,
      vowelRows: VOWEL_ROWS,
      pEndings: PModule.endings
    }),
    selfTest
  });
});
