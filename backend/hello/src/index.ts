import grpc, { requestCallback, ServerUnaryCall } from 'grpc';
import { HelloService } from './generated/hello_grpc_pb';
import { HelloRequest, HelloReply } from './generated/hello_pb';

async function main() {
  var server = new grpc.Server();
  server.addService(HelloService, {
    hello: (
      call: ServerUnaryCall<HelloRequest>,
      callback: requestCallback<HelloReply>
    ) => {
      var reply = new HelloReply();
      reply.setMessage(`Hello ${call.request.getName()}!`);
      callback(null, reply);
    }
  });
  server.bind('0.0.0.0:80', grpc.ServerCredentials.createInsecure());
  server.start();
}

main().catch(error => {
  console.error(error?.stack);
  process.exit(1);
});
