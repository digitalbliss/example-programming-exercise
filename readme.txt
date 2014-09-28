Decided to use Javascript as it is the language that is more
relevant to the job spec. Used HTML and CSS to provide a very basic
UI that was hastily put together. 

Used jquery to manipulate the DOM and to do UI related work.

I created a VendingMachine object that encapsulates the functionality
but due to the time constraint I took some shortcuts.

For example I sometimes access the UI directly from within 
the object which is bad. If time wasn't an issue I would have used callbacks. 

Also I didn't not make attributes private using
closures and getters and setters so everything is accessible publicly 
from the Vending Machine object which is also bad.

Had a bit of trouble with the JS rounding errors but I think they 
are solved, with the exception of the one that is still there if you enter
*.99 which gets rounded to *.98.

As per spec machine change is unlimited and also as soon as an item
is dispensed the remaining change is returned.

I hope the UI is straightforward.

