'use strict';

var _ = require('lodash');
var Person = require('./person.model');
var Interest = require('../interest/interest.model');
var PersonInterest = require('../personInterest/personInterest.model');
/*var Avatar = require('../avatar/avatar.model');
var PersonAvatar = require('../personAvatar/personAvatar.model');
var PersonImage = require('../personImage/personImage.model');
var Language = require('../language/language.model');
var PersonLanguage = require('../personLanguage/personLanguage.model');
var Notification = require('../notification/notification.model');
var PersonNotification = require('../personNotification/personNotification.model');
var Setting = require = require('../setting/setting.model');
var PersonSetting = require('../personSetting/personSetting.model');
var PersonStatus = require('../personStatus/personStatus.model');*/


// Get list of persons
exports.index = function(req, res) {
  Person.find(function (err, persons) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(persons);
  });
};
/*exports.getByFull = function(req, res) {
  Person.find(function (err, persons) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(persons);
  });
};*/



// Get a single person
exports.show = function(req, res) {
  Person.findById(req.params.id, function (err, person) {
    if(err) { return handleError(res, err); }
    if(!person) { return res.status(404).send('Not Found'); }
    return res.json(person);
  });
};

exports.getPersonFriendByInterestOfset = function (req,res) {
  if (req.params.startIndex && req.params.rowCount) {
    var offsetIndex = parseInt(req.params.startIndex);
    var ofsetCount = parseInt(req.params.rowCount);
    var result = {
      personCount: 0,
      personArray: []
    };
    console.time('mongo corr ofset');
    Person.find({isActive: true}).sort({firstName: 1}).skip(offsetIndex).limit(ofsetCount - offsetIndex).exec(function (error, personData) {
      console.timeEnd('mongo corr ofset');
      if (!error) {
        console.time('mongo corr count');
        Person.count({isActive: true}).exec(function (error, count) {
          console.timeEnd('mongo corr count');
          result.personCount = count;
          result.personArray = personData;
          callback(false, result);
        });
      } else {
        callback(true, null);
      }
    });
  } else {
    callback(true, null);
  }
}

/*CorrespondentModel.prototype.getCorrespondentByOfset = function (startIndex, rowCount, callback) {
  var instance = this;
  if (startIndex && rowCount) {
    var offsetIndex = parseInt(startIndex);
    var ofsetCount = parseInt(rowCount);
    var result = {
      correspondentCount: 0,
      correspondentArray: []
    };
    console.time('mongo corr ofset');
    instance.Correspondent.find({isActive: true}).sort({displayName: 1}).skip(offsetIndex).limit(ofsetCount - offsetIndex).exec(function (error, correspondentData) {
      console.timeEnd('mongo corr ofset');
      if (!error) {
        console.time('mongo corr count');
        instance.Correspondent.count({isActive: true}).exec(function (error, count) {
          console.timeEnd('mongo corr count');
          result.correspondentCount = count;
          result.correspondentArray = correspondentData;
          callback(false, result);
        });
      } else {
        callback(true, null);
      }
    });
  } else {
    callback(true, null);
  }
};*/

/*exports.getPersonInterest = function (req,res) {
  var personInterest = [];
  PersonInterest.find({personId : req.params.id }, { interestId: 1, _id: 0 }, function(err, result) {
    for(var i = 0; i < result.length; i++) {
      personInterest.push(result[i].interestId);
    }
    Interest.find({ _id : { $in : personInterest}}, function (err, result2) {
      return res.json(result2);
    })
  });
};*/

/*exports.getPersonNonInterest = function (req,res) {
  var personInterest = [];
  PersonInterest.find({personId : req.params.id }, { interestId: 1, _id: 0 }).populate().exec(function(err, result) {
    for(var i = 0; i < result.length; i++) {
     personInterest.push(result[i].interestId);
     }
     Interest.find({ _id : { $nin : personInterest}}, function (err, result2) {
     return res.json(result2);
     })
  });
};*/

/*exports.getPersonNonInterest = function (req,res) {
  var personInterest = [];
  PersonInterest.find({personId : req.params.id }, { interestId: 1, _id: 0 }).populate().exec(function(err, result) {
    for(var i = 0; i < result.length; i++) {
     personInterest.push(result[i].interestId);
     }
     Interest.find({ _id : { $nin : personInterest}}, function (err, result2) {
     return res.json(result2);
     })
  });
};*/




exports.create = function (req, res) {
  if (req.body.userName == "") {
    return res.status(400).send("Kullanıcı adı boş kalamaz");
  }
  if (req.body.id == "") {
    return res.status(400).send("facebook id boş kalamaz");
  }
  Person.find({id: req.body.id}, function (err, personData) {
    if (personData.length > 1) {
      return res.status(406).send("Bu id kullanılmaktadır");
    } else {
      Person.create(req.body, function (err, person) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(201).json(person);
      });
    }
  })
};



// Updates an existing person in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Person.findById(req.params.id, function (err, person) {
    if (err) { return handleError(res, err); }
    if(!person) { return res.status(404).send('Böyle bir kişi bulunmamaktadır'); }
    var updated = _.merge(person, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(person);
    });
  });
};

// Deletes a person from the DB.
exports.destroy = function(req, res) {
  Person.findById(req.params.id, function (err, person) {
    if(err) { return handleError(res, err); }
    if(!person) { return res.status(404).send('Not Found'); }
    person.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
