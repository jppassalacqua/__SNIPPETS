function replaceImageSysID(recordSysId = "3431bdc287b27950b989a8690cbb3575") {
  var tableName = "kb_knowledge";
  var url = "sys_attachment.do?sys_id=";
  var attachmentArray = [];
  var before_regex = new RegExp(
    '<div id="main-content" class="wiki-content group">',
    "j"
  );
  var pageSection = new RegExp('<div class="pageSection group">', "j");
  var regex = new RegExp("attachments/[0-9]*/", "j");
  var title_regex_start = new RegExp('<span id="title-text">', "j");
  var title_regex_end = new RegExp("</span></h1>", "j");
  function before(value, delimiter) {
    value = value || "";
    return delimiter === "" ? value : value.split(delimiter).shift();
  }

  function afterLast(value, delimiter) {
    value = value || "";
    return delimiter === "" ? value : value.split(delimiter).pop();
  }

  var grKB = new GlideRecord(tableName);
  if (grKB.get(recordSysId)) {
    var body = grKB.getValue("text");
    var before_main_content = before(body, before_regex);
    var after_page_section = afterLast(body, pageSection);
    var before_page_section = before(body, pageSection);
    /**
     *  GET THE TITLE OF THE ARTICLE
     */
    var titleRegex1 = before(body, title_regex_end);
    var titleRegex2 = afterLast(titleRegex1, title_regex_start);
    var title = before_main_content.replace(before_main_content, titleRegex2);
    var delete_before_main_content = before_main_content.replace(
      before_main_content,
      ""
    );
    var delete_after_pageSection = after_page_section.replace(
      after_page_section,
      ""
    );
    var getMainContent = before_page_section.replace(
      before_main_content,
      delete_before_main_content
    );
    grKB.text = getMainContent;
    grKB.text = grKB.text.replace(body, getMainContent);
    grKB.text = text.replace(body, "");
    grKB.text = grKB.text.replace(text, getMainContent);
    grKB.update();

    //     //gs.info("text: " +    grKB.text )

    var attachments = new GlideSysAttachment();
    var agr = attachments.getAttachments(tableName, recordSysId);
    var text = grKB.getValue("text");
    var rowCount = agr.getRowCount();
    //gs.info("Total filed attached in ALL TEXT: " + rowCount);
    while (agr.next()) {
      var src_img = text.match(regex);
      var attachment = {};
      attachment.sys_id = agr.getValue("sys_id");
      attachment.file_name = agr.getValue("file_name");
      attachmentArray.push(attachment);
    }

    for (var i = 0; i < attachmentArray.length; i++) {
      var elem_sysId = attachmentArray[i].sys_id;
      var newelem_sysid = url + elem_sysId;
      var elem_file_name = src_img + attachmentArray[i].file_name;
      var changed_url = elem_file_name.replace(elem_file_name, newelem_sysid);
      var check = grKB.text.includes(elem_file_name);
      if (check === true) {
        //gs.info(" SYSID: \n" + elem_sysId + "\n Filename: " + elem_file_name);
        //gs.info("\n Changed url : \n" + changed_url);
        grKB.text = grKB.text.replaceAll(elem_file_name, changed_url);
        grKB.update();
      } else {
        //gs.info("No Matching Image FOUND");
      }
    }
  }
}
