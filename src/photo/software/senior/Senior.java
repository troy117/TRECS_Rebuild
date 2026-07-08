package photo.software.senior;


public class Senior {
	public String ref, first, last, ID, homeroom, notes, orders, code;
	
	public Senior(String ref, String first, String last, String ID, String homeroom, String notes, String orders, String code)
	{
		this.ref= ref;
		this.first = first;
		this.last = last;
		this.ID = ID;
		this.homeroom = homeroom;
		this.notes = notes;
		this.orders = orders;
		this.code = code;
	}
	public Senior(String ref, String first, String last)
	{
		this.ref = ref;
		this.first = first;
		this.last = last;
		this.ID = "";
		this.homeroom = "";
		this.notes = "";
		this.orders = "";
		this.code = "";
	}
	public Senior(String ref)
	{
		this.ref = ref;
		this.first = "";
		this.last = "";
		this.ID = "";
		this.homeroom = "";
		this.notes = "";
		this.orders = "";
		this.code = "";
	}
	public boolean equals(Object o)
	{
		if(o!=null & o instanceof Senior)
		{
			return this.ref.equals(((Senior)o).ref);
		}
		return false;
	}

}
