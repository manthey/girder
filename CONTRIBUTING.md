Contributing to Girder
======================

There are many ways to contribute to Girder, with varying levels of effort.  Do try to look through the documentation first if something is unclear, and let us know how we can do better.

  * Ask a question on the [Girder users email list](http://public.kitware.com/mailman/listinfo/girder-users)
  * Ask a question in the [Gitter Forum](https://gitter.im/girder/girder)
  * Submit a feature request or bug, or add to the discussion on the [Girder issue tracker](https://github.com/girder/girder/issues)
  * Submit a [Pull Request](https://github.com/girder/girder/pulls) to improve Girder or its documentation

We encourage a range of Pull Requests, from patches that include passing tests and documentation, all the way down to half-baked ideas that launch discussions.

The PR Process, Travis CI, and Related Gotchas
----------------------------------------------

When you submit a PR to the Girder repo, Travis CI will run the full build on two different branches

  * The commit at the head of the PR branch, the `push` build
  * The head of the PR branch that is then merged into `master`, the `pr` branch

The Travis build will run according to the [.travis.yml file](/.travis.yml), which is useful as an example for how to set up your own environment for testing.  We are currently using containerized builds on Travis, and for each branch, will test against both Mongo v2.6.8 and Mongo v3.0.1.

#### Confusing failing test message "AttributeError: 'module' object has no attribute 'x_test'"

This is also a gotcha for your local testing environment.  If a new dependency is introduced during development, but is not in the test environment, usually because the dependency is not included in a `requirements.txt` or `requirements-dev.txt` file, or because those requirements are not installed via `pip`, a test can fail that attempts to import that dependency and can print a confusing message in the test logs like "AttributeError: 'module' object has no attribute 'x_test'".

As an example, the HDFS plugin has a dependency on the Python module `snakebite`, specified in the [HDFS plugin requirements.txt file](https://github.com/girder/girder/blob/master/plugins/hdfs_assetstore/requirements.txt). If this dependency was not included in the requirements file, or if that requirements file was not included in the [.travis.yml file](/.travis.yml) (or that requirements file was not `pip` installed in a local test environment), when the test defined in [the assetstore_test.py file](https://github.com/girder/girder/blob/master/plugins/hdfs_assetstore/plugin_tests/assetstore_test.py#L27-L28) is run, the `snakebite` module will not be found, but the exception will be swallowed by the testing environment and instead the `assetstore_test` module will be considered invalid, resulting in the confusing error message

    AttributeError: 'module' object has no attribute 'assetstore_test'

but you won't be confused now, will you?
