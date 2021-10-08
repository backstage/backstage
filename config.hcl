# This denotes the start of the configuration section for Consul. All values
# contained in this section pertain to Consul.
consul {
  # This block specifies the basic authentication information to pass with the
  # request. For more information on authentication, please see the Consul
  # documentation.
  auth {
    enabled  = false
    username = "test"
    password = "test"
  }

  # Address of the Consul endpoint
  # address = "127.0.0.1:8500"

  # Consul ACL token and also available via environment variables CONSUL_TOKEN
  # token = "abcd1234"

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
    verify = false

    # This is the path to the certificate to use to authenticate. If just a
    # certificate is provided, it is assumed to contain both the certificate and
    # the key to convert to an X509 certificate. If both the certificate and
    # key are specified, Envconsul will automatically combine them into an X509
    # certificate for you.
    cert = "/path/to/client/cert"
    key  = "/path/to/client/key"

    # This is the path to the certificate authority to use as a CA. This is
    # useful for self-signed certificates or for organizations using their own
    # internal certificate authority.
    ca_cert = "/path/to/ca"

    # This is the path to a directory of PEM-encoded CA cert files. If both
    # `ca_cert` and `ca_path` is specified, `ca_cert` is preferred.
    ca_path = "path/to/certs/"

    # This sets the SNI server name to use for validation.
    server_name = "my-server.com"
  }
}

# This block defines the configuration the the child process to execute and
# manage.
exec {
  # This is the command to execute as a child process. There can be only one
  # command per process.
  command = "node packages/backend --config app-config.yaml"

  # This is a random splay to wait before killing the command. The default
  # value is 0 (no wait), but large clusters should consider setting a splay
  # value to prevent all child processes from reloading at the same time when
  # data changes occur. When this value is set to non-zero, Envconsul will wait
  # a random period of time up to the splay value before killing the child
  # process. This can be used to prevent the thundering herd problem on
  # applications that do not gracefully reload.
  splay = "5s"

  env {
    # This specifies if the child process should not inherit the parent
    # process's environment. By default, the child will have full access to the
    # environment variables of the parent. Setting this to true will send only
    # the values specified in `custom_env` to the child process.
    pristine = false

    # This specifies additional custom environment variables in the form shown
    # below to inject into the child's runtime environment. If a custom
    # environment variable shares its name with a system environment variable,
    # the custom environment variable takes precedence. Even if pristine,
    # allowlist, or denylist is specified, all values in this option
    # are given to the child process.
    # custom = ["PATH=$PATH:/etc/myapp/bin"]

    # This specifies a list of environment variables to exclusively include in
    # the list of environment variables exposed to the child process. If
    # specified, only those environment variables matching the given patterns
    # are exposed to the child process. These strings are matched using Go's
    # glob function, so wildcards are permitted.
    # allowlist = ["CONSUL_*"]

    # This specifies a list of environment variables to exclusively prohibit in
    # the list of environment variables exposed to the child process. If
    # specified, any environment variables matching the given patterns will not
    # be exposed to the child process, even if they are in the allowlist. The
    # values in this option take precedence over the values in the allowlist.
    # These strings are matched using Go's glob function, so wildcards are
    # permitted.
    # denylist = ["VAULT_*"]
  }

  # This defines the signal sent to the child process when Envconsul is
  # gracefully shutting down. The application should begin a graceful cleanup.
  # If the application does not terminate before the `kill_timeout`, it will
  # be terminated (effectively "kill -9"). The default value is shown below.
  kill_signal = "SIGTERM"

  # This defines the amount of time to wait for the child process to gracefully
  # terminate when Envconsul exits. After this specified time, the child
  # process will be force-killed (effectively "kill -9"). The default value is
  # "30s".
  kill_timeout = "2s"
}

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

# This is the path to store a PID file which will contain the process ID of the
# Envconsul process. This is useful if you plan to send custom signals
# to the process.
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
  # no_prefix = false

  # This is the path of the key in Consul or Vault from which to read data.
  # The path field is required or the config block will be ignored.
  path = "config/bih/development"

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

# This block defines the configuration for connecting to a syslog server for
# logging.
syslog {
  # This enables syslog logging. Specifying any other option also enables
  # syslog logging.
  enabled = false

  # This is the name of the syslog facility to log to.
  facility = "LOCAL5"
}

# This tells Envconsul to convert environment variable keys to uppercase (which
# is more common and a bit more standard).
upcase = true
