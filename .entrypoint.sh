alias antlr4='java -Xmx500M -cp "$(pwd)/vendor/antlr-4.9-complete.jar:$CLASSPATH" org.antlr.v4.Tool'
alias grun='java -Xmx500M -cp "$(pwd)/vendor/antlr-4.9-complete.jar:$CLASSPATH" org.antlr.v4.gui.TestRig'
export CLASSPATH=".:$(pwd)/vendor/antlr-4.9-complete.jar:$CLASSPATH"