 PDFParser = require("pdf2json");

module.exports = {


  friendlyName: 'Pdf tag extracteur',


  description: 'Extract tags for a spesific PDF file',


  inputs: {
    pdfFile: {
      friendlyName: 'Full path to pdf file',
      type: 'string',
    },
  },


  exits: {
    success: {
      outputFriendlyName: 'Objects fill with extracted tags',
    }
  },


  fn: async function (inputs, exits) {

    let pdfFile = inputs.pdfFile;

    let pdfParser = new PDFParser(this,1);

    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
    pdfParser.on("pdfParser_dataReady", pdfData => {
      let allText = pdfParser.getRawTextContent();

      // create empty data
      let rdsInfo = {
        nombreSignature: null,
        nom: null,
        description: null,
        date: null,
        heure: null,
        lieu: null,
        urlComplementaire: null,
        sujet: null,
        corps: null,
        nombreRelance: null,
        periodicite: null,
        delaisMinimum: null,
        entreprise: null,
        administrateur: {
          nom: null,
          prenom: null,
          email: null,
        },
        signataires: [],
      };

      // list of regex
      let adminRegex = /#ADMIN#(\w+)?#(\w+)?#(.*)?#/i;
      let usersRegex1 = /#(user\d+)#(.*)?#/gi;
      let usersRegex2 = /#(user\d+)#(.*)?#(.*)?#(.*)?#(.*)?#/i;
      let scheduleRegex = /#schedule#([0-9]{4}-[0-9]{2}-[0-9]{2})?#([0-9]{2}:[0-9]{2})?#(.*)?#(.*)?#/i;
      let retryRegex = /#retry#([0-9]*)#([0-9]*)#([0-9]*)#/i;

      let meetingRegex = /MEETING/i;
      let subjectRegex = /SUBJECT/i;

      // extract meeting infos
      let splitedText = allText.split("#");
      
      let lastTextMatch = false;
      let lastTextIsMeetingSujet = false;

      for (var ii = 0, cc = splitedText.length ; ii < cc; ii++) {
      if (lastTextIsMeetingSujet) {
          rdsInfo.description = splitedText[ii];
          lastTextIsMeetingSujet = false;
          break;
        }

        if (lastTextMatch) {
          rdsInfo.nom = splitedText[ii];
          lastTextIsMeetingSujet = true;
          lastTextMatch = false;
        }

        if (meetingRegex.test(splitedText[ii])) {
          lastTextMatch = true;
        }
      }

      // extract email infos
      
      lastTextMatch = false;
      let lastTextIsEmailSujet = false;

      for (var ii = 0, cc = splitedText.length ; ii < cc; ii++) {
      if (lastTextIsMeetingSujet) {
          rdsInfo.corps = splitedText[ii];
          lastTextIsEmailSujet = false;
          break;
        }

        if (lastTextMatch) {
          rdsInfo.sujet = splitedText[ii];
          lastTextIsEmailSujet = true;
          lastTextMatch = false;
        }

        if (subjectRegex.test(splitedText[ii])) {
          lastTextMatch = true;
        }
      }

      // extract admin metadata
      let result1 = allText.match(adminRegex);

      rdsInfo.administrateur.nom = result1[1];
      rdsInfo.administrateur.prenom = result1[2];
      rdsInfo.administrateur.email = result1[3];

      // extract schedule metadata
      let result4 = allText.match(scheduleRegex);

      rdsInfo.date = result4[1];
      rdsInfo.heure = result4[2];
      rdsInfo.lieu = result4[3];
      rdsInfo.urlComplementaire = result4[4];

      // extract retry metadata
      let result5 = allText.match(retryRegex);

      rdsInfo.delaisMinimum = +result5[1];
      rdsInfo.nombreRelance = +result5[2];
      rdsInfo.periodicite = +result5[3];

      // extract users metadata
      let result2 = allText.match(usersRegex1);

      result2.forEach( userText => {
        let result3 = userText.match(usersRegex2);

        let userObject = {
          nom: result3[2],
          prenom: result3[3],
          entreprise: result3[4],
          email: result3[5],
          identifiant: result3[1],
        };

        rdsInfo.signataires.push(userObject);
      });

      // All done.
      return exits.success(rdsInfo);
    });
 
    pdfParser.loadPDF(pdfFile);
  }
};

