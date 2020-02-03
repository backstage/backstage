import grpc, { requestCallback, ServerUnaryCall } from "grpc";
import { ScaffolderService } from "./generated/scaffolder_grpc_pb";
import { ScaffolderRequest, ScaffolderReply } from "./generated/scaffolder_pb";

async function main() {
  var server = new grpc.Server();
  server.addService(ScaffolderService, {
    scaffolder: (
      call: ServerUnaryCall<ScaffolderRequest>,
      callback: requestCallback<ScaffolderReply>
    ) => {
      var reply = new ScaffolderReply();
      reply.setMessage(`Scaffolder ${call.request.getName()}!`);
      callback(null, reply);
    }
  });
  server.bind("0.0.0.0:80", grpc.ServerCredentials.createInsecure());
  server.start();
}

main().catch(error => {
  console.error(error?.stack);
  process.exit(1);
});
