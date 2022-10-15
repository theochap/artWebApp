dropdb --if-exists artefact_test;
dropuser --if-exists admin_test;
createuser -d admin_test;
createdb artefact_test -O admin_test;
psql -U admin_test -d artefact_test -f ./config/tables_creation.sql