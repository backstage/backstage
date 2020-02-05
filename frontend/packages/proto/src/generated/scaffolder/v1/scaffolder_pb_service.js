// package: spotify.backstage.scaffolder.v1
// file: scaffolder/v1/scaffolder.proto

var scaffolder_v1_scaffolder_pb = require("../../scaffolder/v1/scaffolder_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Scaffolder = (function () {
  function Scaffolder() {}
  Scaffolder.serviceName = "spotify.backstage.scaffolder.v1.Scaffolder";
  return Scaffolder;
}());

Scaffolder.GetAllTemplates = {
  methodName: "GetAllTemplates",
  service: Scaffolder,
  requestStream: false,
  responseStream: false,
  requestType: scaffolder_v1_scaffolder_pb.Empty,
  responseType: scaffolder_v1_scaffolder_pb.GetAllTemplatesResponse
};

exports.Scaffolder = Scaffolder;

function ScaffolderClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

ScaffolderClient.prototype.getAllTemplates = function getAllTemplates(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Scaffolder.GetAllTemplates, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.ScaffolderClient = ScaffolderClient;

