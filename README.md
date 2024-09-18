# JavaScript Samples

Pure JavaScript, CSS, and HTML. No Angular, Material, or React.

What will appear here are implementations of UI elements provided by Angular Material.
I've been using Material for so long that if asked to write an accordion in an interview,
I probably couldn't do it.

One of the drawbacks to using a powerful framework is forgetting how to do stuff at a more
basic level.

## accordion

A sample accordion, populated with a small set of science fiction titles and descriptions,
loaded from data.json. User must host the page, e.g. using _**http-server**_.

The accordion allows only a single open tab at a time, though a checkbox can be set to
allow multiple tabs to be open. When multiple are open and the box is unchecked, all but
the first will be closed.

A _**Loading data...**_ message will appear briefly, before the accordion is populated. On error,
an error card will appear. When the data is displayed, a note appears at the bottom stating
that the descriptions were culled from Wikipedia.

Once retrieved, the data is sorted by title, with accommodation for _**The**_ at the beginning
of a title. _**A**_ and _**An**_ are left as an exercise for another time.
