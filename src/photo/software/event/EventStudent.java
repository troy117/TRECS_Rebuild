package photo.software.event;

public class EventStudent 
{
	public String ref, image, first, last, homeroom, order, notes;
	public EventStudent(String ref, String image, String first, String last, String homeroom, String order, String notes)
	{
		this.ref = ref;
		this.image = image;
		this.first = first;
		this.last = last;
		this.homeroom = homeroom;
		this.order = order;
		this.notes = notes;
	}
	public EventStudent(EventStudent s)
	{
		this.ref = s.ref;
		this.image = s.image;
		this.first = s.first;
		this.last = s.last;
		this.homeroom = s.homeroom;
		this.order = s.order;
		this.notes = s.notes;
	}
	public EventStudent(EventStudent s, String order)
	{
		this.ref = s.ref;
		this.image = s.image;
		this.first = s.first;
		this.last = s.last;
		this.homeroom = s.homeroom;
		this.order = order;
		this.notes = s.notes;
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
