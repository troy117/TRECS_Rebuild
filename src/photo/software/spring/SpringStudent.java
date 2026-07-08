package photo.software.spring;

public class SpringStudent 
{
	public String ref, img, last, first, homeroom, grade, order1, order2, notes, text1, text2, text3;
	public SpringStudent(String ref, String img, String last, String first, String homeroom, String grade, String order1, String order2, String notes, String text1, String text2, String text3)
	{
		this.ref = ref;
		this.img = img;
		this.last = last;
		this.first = first;
		this.homeroom = homeroom;
		this.grade = grade;
		this.order1 = order1;
		this.order2 = order2;
		this.notes = notes;
		this.text1 = text1;
		this.text2 = text2;
		this.text3 = text3;
	}
	public SpringStudent(String ref)
	{
		this.ref = ref;
		this.img = "";
		this.last = "";
		this.first = "";
		this.homeroom = "";
		this.grade = "";
		this.order1 = "";
		this.order2 = "";
		this.notes = "";
		this.text1 = "";
		this.text2 = "";
		this.text3 = "";
	}
	public boolean equals(Object o)
	{
		if(o!=null & o instanceof SpringStudent)
		{
			return this.ref.equals(((SpringStudent)o).ref);
		}
		return false;
	}
}
