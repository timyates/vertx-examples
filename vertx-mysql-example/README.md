## MySQL example

This example requires that you have a mysql db installed somewhere

## Note!

After you run it the first time, you need to run:

    cp lib/mysql-connector-java-5.1.22-bin.jar mods/com.bloidonia.jdbc-persistor-v1.0/libs

So that the module knows about MySQL when it is deployed (there isn't currently a mechanism for this sort of runtime-dependency management in vert.x)

## Assumptions

It assumes the db is installed on `localhost` and has a db called `vertx` which contains a table `messages` containing a `name` field and a `message` field.

It also assumes the username and password for this database is `test`

If this is not the case with your setup, all these things can be altered in the config section at the bottom of `app.js`