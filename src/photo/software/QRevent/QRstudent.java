package photo.software.QRevent;

import photo.software.event.EventStudent;

public class QRstudent 
{
	public String ref, image, first, last, homeroom, order, notes, rand;
	public QRstudent(String ref, String image, String first, String last, 
				String homeroom, String order, String notes, String rand)
	{
		this.ref = ref;
		this.image = image;
		this.first = first;
		this.last = last;
		this.homeroom = homeroom;
		this.order = order;
		this.notes = notes;
		this.rand = rand;
	}
	public QRstudent(QRstudent s)
	{
		this.ref = s.ref;
		this.image = s.image;
		this.first = s.first;
		this.last = s.last;
		this.homeroom = s.homeroom;
		this.order = s.order;
		this.notes = s.notes;
		this.rand = s.rand;
	}
	public QRstudent(QRstudent s, String order)
	{
		this.ref = s.ref;
		this.image = s.image;
		this.first = s.first;
		this.last = s.last;
		this.homeroom = s.homeroom;
		this.order = order;
		this.notes = s.notes;
		this.rand = s.rand;
	}
	public QRstudent(String ref, String rand)
	{
		this.ref = ref;
		this.image = "";
		this.first = "";
		this.last = "";
		this.homeroom = "";
		this.order = "";
		this.notes = "";
		this.rand = rand;
		
	}
	public boolean equals(Object o)
	{
		if(o!=null & o instanceof EventStudent)
		{
			return this.ref.equals(((EventStudent)o).ref);
		}
		return false;
	}
	
}
