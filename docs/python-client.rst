Python Client and Girder CLI
============================

In addition to the web clients, Girder comes with a python client library and
a CLI to allow for programmatic interaction with a Girder server, and also to
workaround limitations of the web client. For example, the python CLI makes it
much easier to upload a large, nested hierarchy of data from a local directory
to Girder, and also makes it much easier to download a large, nested hierarchy
of data from Girder to a local directory.

Installation
------------

If you have the source directory of Girder, you can find the ``girder_client``
package within the ``clients/python`` directory. If you do not have the source
directory of Girder, you can install the client via pip: ::

    pip install girder-client

The Command Line Interface
--------------------------

The girder_client package ships with a command-line utility that wraps some of
its common functionality to make it easy to invoke operations without having
to write any custom python scripts. If you have installed girder_client via
pip, you can use the special ``girder-cli`` executable: ::

    girder-cli <arguments>

Otherwise you can equivalently just invoke the module directly: ::

    python -m girder_client <arguments>

Specifying the Girder Instance
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The default host for the girder_client is `localhost`.  To specify the host
with cli usage ::

    python cli.py --host girder.example.com

To specify a host using SSL (https) ::

    python cli.py --host girder.example.com --scheme https --port 443

Upload a local file hierarchy
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Currently, the girder_client does not support uploads to the S3 Assetstore type
"""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

The upload command, ``-c upload``, is the default, so the following two forms
are equivalent ::

    python cli.py
    python cli.py -c upload

To upload a folder hierarchy rooted at `test_folder` to the Girder Folder with
id `54b6d41a8926486c0cbca367` ::


    python cli.py 54b6d41a8926486c0cbca367 test_folder

When using the upload command, the default ``--parent-type``, meaning the type
of resource the local folder will be created under in Girder, is Folder, so the
following are equivalent ::

    python cli.py 54b6d41a8926486c0cbca367 test_folder
    python cli.py 54b6d41a8926486c0cbca367 test_folder --parent-type folder

To upload that same local folder to a Collection or User, specify the parent
type as follows ::

    python cli.py 54b6d41a8926486c0cbca459 test_folder --parent-type user

To see what local folders and files on disk would be uploaded without actually
uploading anything, add the ``--dryrun`` flag ::

    python cli.py 54b6d41a8926486c0cbca367 test_folder --dryrun

To have leaf folders (those folders with no subfolders, only containing files)
be uploaded to Girder as single Items with multiple Files, i.e. those leaf
folders will be created as Items and all files within the leaf folders will be
Files within those Items, add the ``--leaf-folders-as-items`` flag ::

    python cli.py 54b6d41a8926486c0cbca367 test_folder --leaf-folders-as-items

If you already have an existing Folder hierarchy in Girder which you have a
superset of on your local disk (e.g. you previously uploaded a hierarchy to
Girder and then added more folders and files to the hierarchy on disk), you can
reuse the existing hierarchy in Girder, which will not create new Folders and
Items for those that match folders and files on disk, by using the ``--reuse`` flag.

::

    python cli.py 54b6d41a8926486c0cbca367 test_folder --reuse

To include a blacklist of filepatterns that will not be uploaded, pass a comma
separated list to the ``--blacklist`` arg ::

    python cli.py 54b6d41a8926486c0cbca367 test_folder --blacklist .DS_Store

Download a Folder hierarchy into a local folder
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To download a Girder Folder hierarchy rooted at Folder id
`54b6d40b8926486c0cbca364` under the local folder `download_folder` ::

    python cli.py -c download 54b6d40b8926486c0cbca364 download_folder

Downloading is only supported from a parent type of Folder.

The Python Client Library
-------------------------

For those wishing to write their own python scripts that interact with Girder,
we recommend using the Girder python client library, documented below.

Recursively inherit access control to a Folder's descendants
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This will take the access control and public value in the Girder Folder with
id `54b43e9b8926486c0c06cb4f` and copy those to all of the descendant Folders

.. code-block:: python

    import girder_client
    gc = girder_client.GirderClient()
    gc.authenticate('username', 'password')
    gc.inheritAccessControlRecursive('54b43e9b8926486c0c06cb4f')

Set callbacks for Folder and Item uploads
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

If you have a function you would like called upon the completion of an Item
or Folder upload, you would do the following.

N.B. The Item callbacks are called after the Item is created and all Files are uploaded to the Item.  The Folder callbacks are called after the Folder is created and all child Folders and Items are uploaded to the Folder.


.. code-block:: python

    import girder_client
    gc = girder_client.GirderClient()

    def folder_callback(folder, filepath):
        # assume we have a folder_metadata dict that has
        # filepath: metadata_dict_for_folder
        gc.addMetadataToFolder(folder['_id'], folder_metadata[filepath])

    def item_callback(item, filepath):
        # assume we have an item_metadata dict that has
        # filepath: metadata_dict_for_item
        gc.addMetadataToItem(item['_id'], item_metadata[filepath])

    gc.authenticate('username', 'password')
    gc.add_folder_upload_callback(folder_callback)
    gc.add_item_upload_callback(item_callback)
    gc.upload(local_folder, parent_id)


Further Examples and Function Level Documentation
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. automodule:: girder_client
    :members:
