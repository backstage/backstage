# This denotes the start of the configuration section for Consul. All values
# contained in this section pertain to Consul.
consul {
  # This block specifies the basic authentication information to pass with the
  # request. For more information on authentication, please see the Consul
  # documentation.
  auth {
    enabled  = false
    # username = "test"
    # password = "test"
  }

  # This is the address of the Consul agent. By default, this is
  # 127.0.0.1:8500, which is the default bind and port for a local Consul
  # agent. It is not recommended that you communicate directly with a Consul
  # server, and instead communicate with the local Consul agent. There are many
  # reasons for this, most importantly the Consul agent is able to multiplex
  # connections to the Consul server and reduce the number of open HTTP
  # connections. Additionally, it provides a "well-known" IP address for which
  # clients can connect.
  # address = "dev8-consul-helm-server.vault.svc.dev8:8500"
  address = "dev8-consul-helm-server.vault.svc.dev8:80"

  # This is the ACL token to use when connecting to Consul. If you did not
  # enable ACLs on your Consul cluster, you do not need to set this option.
  #
  # This option is also available via the environment variable CONSUL_TOKEN.
  token = "fc2164e1-867b-914d-927b-7201d4a481d9"

  # This controls the retry behavior when an error is returned from Consul.
  # Envconsul is highly fault tolerant, meaning it does not exit in the face
  # of failure. Instead, it uses exponential back-off and retry functions
  # to wait for the cluster to become available, as is customary in distributed
  # systems.
  retry {
    # This enabled retries. Retries are enabled by default, so this is
    # redundant.
    enabled = true

    # This specifies the number of attempts to make before giving up. Each
    # attempt adds the exponential backoff sleep time. Setting this to
    # zero will implement an unlimited number of retries.
    attempts = 12

    # This is the base amount of time to sleep between retry attempts. Each
    # retry sleeps for an exponent of 2 longer than this base. For 5 retries,
    # the sleep times would be: 250ms, 500ms, 1s, 2s, then 4s.
    backoff = "250ms"

    # This is the maximum amount of time to sleep between retry attempts.
    # When max_backoff is set to zero, there is no upper limit to the
    # exponential sleep between retry attempts.
    # If max_backoff is set to 10s and backoff is set to 1s, sleep times
    # would be: 1s, 2s, 4s, 8s, 10s, 10s, ...
    max_backoff = "1m"
  }

  # This block configures the SSL options for connecting to the Consul server.
  ssl {
    # This enables SSL. Specifying any option for SSL will also enable it.
    enabled = false

    # This enables SSL peer verification. The default value is "true", which
    # will check the global CA chain to make sure the given certificates are
    # valid. If you are using a self-signed certificate that you have not added
    # to the CA chain, you may want to disable SSL verification. However, please
    # understand this is a potential security vulnerability.
    # verify = false

    # This is the path to the certificate to use to authenticate. If just a
    # certificate is provided, it is assumed to contain both the certificate and
    # the key to convert to an X509 certificate. If both the certificate and
    # key are specified, Envconsul will automatically combine them into an X509
    # certificate for you.
    # cert = "/path/to/client/cert"
    # key  = "/path/to/client/key"

    # This is the path to the certificate authority to use as a CA. This is
    # useful for self-signed certificates or for organizations using their own
    # internal certificate authority.
    # ca_cert = "/path/to/ca"

    # This is the path to a directory of PEM-encoded CA cert files. If both
    # `ca_cert` and `ca_path` is specified, `ca_cert` is preferred.
    # ca_path = "path/to/certs/"

    # This sets the SNI server name to use for validation.
    # server_name = "my-server.com"
  }
}

# This block defines the configuration the the child process to execute and
# manage.
# exec {
#   # This is the command to execute as a child process. There can be only one
#   # command per process.
#   command = "/usr/bin/app"

#   # This is a random splay to wait before killing the command. The default
#   # value is 0 (no wait), but large clusters should consider setting a splay
#   # value to prevent all child processes from reloading at the same time when
#   # data changes occur. When this value is set to non-zero, Envconsul will wait
#   # a random period of time up to the splay value before killing the child
#   # process. This can be used to prevent the thundering herd problem on
#   # applications that do not gracefully reload.
#   splay = "5s"

#   env {
#     # This specifies if the child process should not inherit the parent
#     # process's environment. By default, the child will have full access to the
#     # environment variables of the parent. Setting this to true will send only
#     # the values specified in `custom_env` to the child process.
#     pristine = false

#     # This specifies additional custom environment variables in the form shown
#     # below to inject into the child's runtime environment. If a custom
#     # environment variable shares its name with a system environment variable,
#     # the custom environment variable takes precedence. Even if pristine,
#     # allowlist, or denylist is specified, all values in this option
#     # are given to the child process.
#     custom = ["PATH=$PATH:/etc/myapp/bin"]

#     # This specifies a list of environment variables to exclusively include in
#     # the list of environment variables exposed to the child process. If
#     # specified, only those environment variables matching the given patterns
#     # are exposed to the child process. These strings are matched using Go's
#     # glob function, so wildcards are permitted.
#     allowlist = ["CONSUL_*"]

#     # This specifies a list of environment variables to exclusively prohibit in
#     # the list of environment variables exposed to the child process. If
#     # specified, any environment variables matching the given patterns will not
#     # be exposed to the child process, even if they are in the allowlist. The
#     # values in this option take precedence over the values in the allowlist.
#     # These strings are matched using Go's glob function, so wildcards are
#     # permitted.
#     denylist = ["VAULT_*"]
#   }

#   # This defines the signal sent to the child process when Envconsul is
#   # gracefully shutting down. The application should begin a graceful cleanup.
#   # If the application does not terminate before the `kill_timeout`, it will
#   # be terminated (effectively "kill -9"). The default value is shown below.
#   kill_signal = "SIGTERM"

#   # This defines the amount of time to wait for the child process to gracefully
#   # terminate when Envconsul exits. After this specified time, the child
#   # process will be force-killed (effectively "kill -9"). The default value is
#   # "30s".
#   kill_timeout = "2s"
# }

# This is the signal to listen for to trigger a graceful stop. The default
# value is shown below. Setting this value to the empty string will cause it
# to not listen for any graceful stop signals.
kill_signal = "SIGINT"

# This is the log level. If you find a bug in Envconsul, please enable debug or
# trace logs so we can help identify the issue. This is also available as a
# command line flag.
log_level = "warn"

# This is the maximum interval to allow "stale" data. By default, only the
# Consul leader will respond to queries; any requests to a follower will
# forward to the leader. In large clusters with many requests, this is not as
# scalable, so this option allows any follower to respond to a query, so long
# as the last-replicated data is within these bounds. Higher values result in
# less cluster load, but are more likely to have outdated data.
max_stale = "10m"

# # This is the path to store a PID file which will contain the process ID of the
# # Envconsul process. This is useful if you plan to send custom signals
# # to the process.
# pid_file = "/path/to/pid"

# This specifies a prefix in Consul to watch. This may be specified multiple
# times to watch multiple prefixes, and the bottom-most prefix takes
# precedence, should any values overlap. Prefix blocks without the path
# defined are meaningless and are discarded. If prefix names conflict with
# secret names, secret names will take precedence.
prefix {
  # This tells Envconsul to use a custom formatter when printing the key. The
  # value between `{{ key }}` will be replaced with the key.
  # format = "custom_{{ key }}"

  # This tells Envconsul to use a custom formatter when printing the key. The
  # value after "replaceKey" in  `{{ key | replaceKey `actualKey` `expectedKey` }}` will be replaced with the next value.
  # You could replace more then one key.
  # format = "custom_{{ key | replaceKey `actualKey1` `expectedKey1` | replaceKey `actualKey2` `expectedKey2` }}"  

  # This tells Envconsul to not prefix the keys with their parent "folder".
  # The default for `prefix` (consul) is true, the default for `secret` (vault)
  # is false. The differing defaults is to maintain backward compatibility.
  no_prefix = false

  # This is the path of the key in Consul or Vault from which to read data.
  # The path field is required or the config block will be ignored.
  path = "bih/dev"

  # This tells Envconsul to use a custom formatter when building the path for
  # the key from which to read data, in this case reading an environment
  # variable and putting it into the path.
  # path = "foo/{{ env \"BAR\" }}"
}

# This tells Envconsul to not include the parent processes' environment when
# launching the child process.
pristine = false

# This is the signal to listen for to trigger a reload event. The default
# value is shown below. Setting this value to the empty string will cause it
# to not listen for any reload signals.
reload_signal = "SIGHUP"

# This tell Envconsul to remove any non-standard values from environment
# variable keys and replace them with underscores.
sanitize = false

# This specifies a secret in Vault to watch. This may be specified multiple
# times to watch multiple secrets, and the bottom-most secret takes
# precedence, should any values overlap. Secret blocks without the path
# defined are meaningless and are discarded. If secret names conflict with
# prefix names, secret names will take precedence.
secret {
  # See `prefix` as they are the same options.
}

# This block defines the configuration for connecting to a syslog server for
# logging.
# syslog {
#   # This enables syslog logging. Specifying any other option also enables
#   # syslog logging.
#   enabled = true

#   # This is the name of the syslog facility to log to.
#   facility = "LOCAL5"
# }

# This tells Envconsul to convert environment variable keys to uppercase (which
# is more common and a bit more standard).
upcase = false

# This denotes the start of the configuration section for Vault. All values
# contained in this section pertain to Vault.
vault {
  # This is the address of the Vault leader. The protocol (http(s)) portion
  # of the address is required.
  address = "https://vault.service.consul:8200"

  # This is the token to use when communicating with the Vault server.
  # Like other tools that integrate with Vault, Envconsul makes the
  # assumption that you provide it with a Vault token; it does not have the
  # incorporated logic to generate tokens via Vault's auth methods.
  #
  # This value can also be specified via the environment variable VAULT_TOKEN.
  token = "abcd1234"

  # This tells Envconsul to load the Vault token from the contents of a file.
  # If this field is specified:
  # - by default Envconsul will not try to renew the Vault token, if you want it
  # to renew you will need to specify renew_token = true as below.
  # - Envconsul will periodically stat the file and update the token if it has
  # changed.
  # vault_agent_token_file = "/path/to/vault/agent/token/file"


  # This tells Envconsul that the provided token is actually a wrapped
  # token that should be unwrapped using Vault's cubbyhole response wrapping
  # before being used. Please see Vault's cubbyhole response wrapping
  # documentation for more information.
  unwrap_token = true

  # This option tells Envconsul to automatically renew the Vault token given.
  # If you are unfamiliar with Vault's architecture, Vault requires tokens be
  # renewed at some regular interval or they will be revoked. Envconsul will
  # automatically renew the token at half the lease duration of the token. The
  # default value is true, but this option can be disabled if you want to renew
  # the Vault token using an out-of-band process.
  #
  # Note that secrets specified as a prefix are always renewed, even if this
  # option is set to false. This option only applies to the top-level Vault
  # token itself.
  renew_token = true

  # This section details the retry options for connecting to Vault. Please see
  # the retry options in the Consul section for more information (they are the
  # same).
  retry {
    # ...
  }

  # This section details the SSL options for connecting to the Vault server.
  # Please see the SSL options in the Consul section for more information (they
  # are the same).
  ssl {
    # ...
  }
}

# This specifies a service in Consul to watch. This may be specified multiple
# times to watch multiple prefixes, and the bottom-most service takes
# precedence, should any values overlap.
service {
  # This is the query of the service in Consul from which to read data.
  query = "my-service"

  # This tells Envconsul to use a custom formatter when printing the key. The
  # value between `{{ key }}` and `{{ service }}` will be replaced with the key
  # and service name. Default format `{{ service }}/{{ key }}`
  format_id = "pg/{{ key }}"
  format_name = "pg/{{ key }}"
  format_address = "pg/host"
  format_tag = "pg/{{ key }}"
  format_port = "pg/{{ key }}"
}

# This is the quiescence timers; it defines the minimum and maximum amount of
# time to wait for the cluster to reach a consistent state before relaunching
# the app. This is useful to enable in systems that have a lot of flapping,
# because it will reduce the the number of times the app is restarted.
wait {
  min = "5s"
  max = "10s"
}