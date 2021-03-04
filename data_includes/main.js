// This is a simple demo script, feel free to edit or delete it
// Find a tutorial and the list of availalbe elements at:
// https://www.pcibex.net/documentation/

PennController.ResetPrefix(null) // Shorten command names (keep this line here)
PennController.DebugOff();


// Show the 'intro' trial first, then the training items in random order
// Then comes the intermission
// The actual experiment presents the sentences randomly, with a break after N sentences.
// After that, send the results and finally show the trial labeled 'bye'.
Sequence("intro", "instructions", "training", "intermission", sepWithN( "break" , randomize("experiment") , 6), "debrief", SendResults(), "goodbye")


// What is in Header happens at the beginning of every single trial
Header(
    // We will use this global Var element later to store the participant's name
    newVar("ParticipantName")
        .global()
    ,
    // Delay of 250ms before every trial
    newTimer(750)
        .start()
        .wait()
)
// .log( "Name" , getVar("ParticipantName") )
// Log the participant
//.log("Name", getVar("ParticipantName"))
.log("ParticipantID", PennController.GetURLParameter("participant") );
// This log command adds a column reporting the participant's name to every line saved to the results

newTrial("intro",

    newText("<p>Welcome!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Informed Consent</strong>:</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Voluntary participation:</strong> I understand that my participation in this study is voluntary.<br/>" +
        "<strong>Withdrawal:</strong> I can withdraw my participation at any time during the experiment.<br/>"+
        "<strong>Risks:</strong> There are no risks involved.<br/>"+
        "<strong>Equipment:</strong> I am participating from a device with a <strong>physical keyboard</strong>.<br/>"+
        "<strong>Environment:</strong> I participate from a quiet environment and can <strong>work uninterrupted</strong>.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>By hitting SPACE I consent to the above.")
        .css("font-family", "Verdana")
        .print()
    ,
    newKey(" ")
        .log()
        .once()
        .wait()
)
newTrial("instructions" ,

    newText("<p><strong>The maze-experiment</strong></p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Your task is to read sentences as fast as possible: to read, you are given two words at a time.<br/>"+
        "The words appear side by side, but only <strong>one</strong> of them is a possible continuation of the sentence.<br/>"+
        "In other words, you need to find a way through a maze:</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newImage("maze", "lmaze.png")
        .size(200,)
        .center()
        .print()
    ,
    newText("<p>Use the <strong>F</strong> and <strong>J</strong> keys to select the word that continues the sentence.<br/>" +
        "If you pick the wrong word, you'll get an error and can try again to continue.</p>" +
        "<p><strong>Please try to be quick <em>and</em> accurate.</strong></p>" +
        "<p>Errors are okay, sometimes even expected. But please try to avoid errors<br/>" +
        "and pay close attention to what you are reading.</p>"+
        "<p>We'll start with up to 8 practice sentences. Training ends early when you have successfully<br/>" +
        "mazed through 3 sentences (it will then take a few seconds to jump the rest and load the main experiment).</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("Hit SPACE to continue to training sentences.")
        .css("font-family", "Verdana")
        .print()
    ,
    newKey(" ")
        .log()
        .once()
        .wait()
) // instructions

Template("training_gmaze.csv", row =>
    newTrial("training",

        newVar("training_successes", 0)
            .global()
            .test.is(v => v > 2)
            .success(end())
        ,

        newController("Maze", {s: row.Sentence, a: row.Distractor})
            .css("font-size", "1.2em")
            .css("font-family", "Verdana")
            .print()
            .log()
            .wait()
            .remove()
            .test.passed()
            .failure(newText("<br/>oops!").css("font-size", "1.5em").css("color", "red").print())
            //.success(newText("<br/>great!").css("font-size", "1.5em").css("color", "green").print())
            .success(getVar("training_successes").set(v => v + 1), newText("<br/>great!").css("font-size", "1.5em").css("color", "green").print())

        ,
        newTimer(500).start().wait()
    )
        // logs additional variables in sentence file (e.g., Fun)
        .log("Id", row.Id)
        .log("Group", row.Group)
        .log("ExpId", row.ExpId)
    ,

) // defines template for the main experiment

newTrial("intermission" ,

    newText("<p>Well done, you should be good to go.<br/>" +
        "Remember: try to be quick <strong>and</strong> accurate.</p>" +
        "<p>Some sentences will be quite complex, some will be simpler.</p>" +
        "<p>The task is mostly fun, but also demanding, so there are designated<br/>" +
        "breaks every 6 sentences.<br/></p>" +
        "<p>(Please <strong>do not</strong> take a break <em>while</em> reading a sentence.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Press SPACE when you are ready to proceed to the main experiment.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newKey(" ")
        .log()
        .once()
        .wait()
) // instructions

Template("gmaze.csv", row =>
    newTrial("experiment",

        newController("Maze", {s: row.Sentence, a: row.Distractor})
            .css("font-size", "1em")
            .css("font-family", "Verdana")
            .print()
            .log()
            .wait()
            .remove()
            .test.passed()
            .failure(newText("<br/>oops!").css("font-size", "1.2em").css("color", "red").print())
            .success(newText("<br/>great!").css("font-size", "1.2em").css("color", "green").print())

        ,
        newTimer(500)
            .start()
            .wait()
    )
        // logs additional variables in sentence file (e.g., Fun)
        .log("Id", row.Id)
        .log("Group", row.Group)
        .log("ExpId", row.ExpId)
    ,
    newTrial("break",

        newText("<p>Well done, you've earned a little rest if you want.</p>" +
            "Press SPACE to continue.")
            .css("font-family", "Verdana")
            .center()
            .log()
            .print()
        ,
        newKey(" ")
            .wait()
    )

) // defines template for the main experiment

newTrial("debrief",

    newText("<p>That's (almost) it, thank you!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Before you go, we'd appreciate it if you take a brief moment to provide voluntary feedback.<br/>" +
        "This information will help us with the evaluation of the results.</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p>Please indicate your handedness:</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newScale("handedness", "right-handed", "left-handed", "no dominant hand", "rather not say")
        .css("font-family", "Verdana")
        .settings.vertical()
        .print()
        .log()
    ,
    newText("<p>In a few words: How did you like this experiment? Difficult? Fun?</p>")
        .css("font-family", "Verdana")
        .print()
    ,
    newTextInput("feedback", "")
        .settings.log()
        .settings.lines(0)
        .settings.size(400, 100)
        .css("font-family", "Verdana")
        .print()
        .log()
    ,
    newText("<p>What do you think the experiment was about?</p>")
        .css("font-family", "Verdana")
        .print()
    ,

    newTextInput("topic", "")
        .settings.log()
        .settings.lines(0)
        .settings.size(400, 100)
        .css("font-family", "Verdana")
        .print()
        .log()
    ,

    newText("<p> </p>")
        .css("font-family", "Verdana")
        .print()
    ,

    newButton("send", "Send results & proceed to verification link")
        .size(300)
        .center()
        .print()
        .wait()
)


SendResults("send") // send results to server before good-bye message

newTrial("goodbye",
    newText("<p>That's it, thank you very much for your time and effort!</p>")
        .css("font-size", "1.2em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><strong>Our feedback</strong>: The task you just did tries to measure how we process sentences"+
        "of varying (presumed) complexity. Trivially, more complex sentences take longer to read, but complexity"+
        "comes in various forms and can be located in different parts of a sentence. Maze experiments"+
        "help us learn more about how people understand and process language (well at least a tiny bit!).</p>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<strong><a href='https://app.prolific.co/submissions/complete?cc=8B2C141F'>Click here to return to Prolific to validate your participation.</a></strong>")
        .css("font-size", "1em")
        .css("font-family", "Verdana")
        .print()
    ,
    newText("<p><br/>You can contact the corresponding researcher <a href='https://www.sfla.ch/' target='_blank'>here</a> (opens new tab).</p>")
        .css("font-size", ".8em")
        .css("font-family", "Verdana")
        .print()
    ,
    newButton("void")
        .wait()
) // the good-bye message

.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial
function SepWithN(sep, main, n) {
    this.args = [sep,main];

    this.run = function(arrays) {
        assert(arrays.length == 2, "Wrong number of arguments (or bad argument) to SepWithN");
        assert(parseInt(n) > 0, "N must be a positive number");
        let sep = arrays[0];
        let main = arrays[1];

        if (main.length <= 1)
            return main
        else {
            let newArray = [];
            while (main.length){
                for (let i = 0; i < n && main.length>0; i++)
                    newArray.push(main.pop());
                for (let j = 0; j < sep.length; ++j)
                    newArray.push(sep[j]);
            }
            return newArray;
        }
    }
}
function sepWithN(sep, main, n) { return new SepWithN(sep, main, n); }

_AddStandardCommands(function(PennEngine){
    this.test = {
        passed: function(){
            return !PennEngine.controllers.running.utils.valuesForNextElement ||
                !PennEngine.controllers.running.utils.valuesForNextElement.failed
        }
    }
});