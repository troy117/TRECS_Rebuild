package photo.software.student;

public class Student 
{
	public String ref, first, last, ID, grade, homeroom, track, 
					photo, field1, field2, notes, order1, order1Pay, order2, order2Pay;

	public Student(String ref, String first, String last, String ID, String grade, String homeroom, String track, String photo, 
						String field1, String field2, String notes, String order1, String order1Pay, String order2, String order2Pay)
	{
		this.ref = ref;
		this.first = first;
		this.last = last;
		this.ID = ID;
		this.grade = gradeFunction(grade);
		this.homeroom = homeroom;
		this.track = track;
		this.photo = photo;
		this.field1  = field1;
		this.field2 = field2;
		this.notes = notes;
		this.order1 = order1;
		this.order1Pay = order1Pay;
		this.order2 = order2;
		this.order2Pay = order2Pay;
	}
	public Student(String last, String first,String id,String grade,String teacher,String track,String field1,String field2)
	{
		this.ref = "";
		this.first = first;
		this.last = last;
		this.ID = id;
		this.grade = gradeFunction(grade);
		this.homeroom = teacher;
		this.track = track;
		this.photo = "false";
		this.field1 = field1;
		this.field2 = field2;
		this.notes = "";
		this.order1 = "";
		this.order1Pay = "false";
		this.order2 = "";
		this.order2Pay = "false";
	}
	public Student(String ref)
	{
	this.ref = ref;
	this.first = "";
	this.last = "";
	this.ID = "";
	this.grade = "";
	this.homeroom = "";
	this.track = "";
	this.photo = "false";
	this.field1 = "";
	this.field2 = "";
	this.notes = "";
	this.order1 = "";
	this.order1Pay = "false";
	this.order2 = "";
	this.order2Pay = "false";
	}
	public Student()
	{
	this.ref = "";
	this.first = "";
	this.last = "";
	this.ID = "";
	this.grade = "";
	this.homeroom = "";
	this.track = "";
	this.photo = "false";
	this.field1 = "";
	this.field2 = "";
	this.notes = "";
	this.order1 = "";
	this.order1Pay = "false";
	this.order2 = "";
	this.order2Pay = "false";
	}
	public Student(Student s)
	{
		this.ref = s.ref;
		this.first = s.first;
		this.last = s.last;
		this.ID = s.ID;
		this.grade = s.grade;
		this.homeroom = s.homeroom;
		this.track = s.track;
		this.photo = s.photo;
		this.field1 = s.field1;
		this.field2 = s.field2;
		this.notes = s.notes;
		this.order1 = s.order1;
		this.order1Pay = s.order1Pay;
		this.order2 = s.order2;
		this.order2Pay = s.order2Pay;
	}
	private String gradeFunction(String s)
	{
		if(s.equals("1")) return "01";
		else if(s.equals("2")) return "02";
		else if(s.equals("3")) return "03";
		else if(s.equals("4")) return "04";
		else if(s.equals("5")) return "05";
		else if(s.equals("6")) return "06";
		else if(s.equals("7")) return "07";
		else if(s.equals("8")) return "08";
		else if(s.equals("9")) return "09";
		else if(s.equals("0")||s.toUpperCase().equals("K")) return "KIN";
		else return s;
	}
	public boolean isBlank()
	{
		if(this.first.equals("")&&last.equals("")) return true;
		return false;
	}
	public boolean equals(Object o)
	{
		if(o!=null & o instanceof Student)
		{
			return this.ref.equals(((Student)o).ref);
		}
		return false;
	}
	public boolean noDiff(Student s)
	{
		if(!ref.equals(s.ref)) return false;
		else if(!first.equals(s.first)) return false;
		else if(!last.equals(s.last)) return false;
		else if(!ID.equals(s.ID)) return false;
		else if(!grade.equals(s.grade)) return false;
		else if(!homeroom.equals(s.homeroom)) return false;
		else if(!track.equals(s.track)) return false;
		else if(!field1.equals(s.field1)) return false;
		else if(!field2.equals(s.field2)) return false;
		else if(!notes.equals(s.notes)) return false;
		else if(!order1.equals(s.order1)) return false;
		else if(!order1Pay.equals(s.order1Pay)) return false;
		else if(!order2.equals(s.order2)) return false;
		else if(!order2Pay.equals(s.order2Pay)) return false;
		return true;
	}
	public String difference(Student s)
	{
		String str="";
		if(!last.equals(s.last)) str+="Last: "+last+" to "+s.last+"\n";
		if(!first.equals(s.first)) str+="First: "+first+" to "+s.first+"\n";
		else if(!ID.equals(s.ID)) str+="ID: "+ID+" to "+s.ID+"\n";
		else if(!grade.equals(s.grade)) str+="Grade: "+grade+" to "+s.grade+"\n";
		else if(!homeroom.equals(s.homeroom)) str+="Homeroom: "+homeroom+" to "+s.homeroom+"\n";
		else if(!track.equals(s.track)) str+="Track: "+track+" to "+s.track+"\n";
		else if(!field1.equals(s.field1)) str+="Field1: "+field1+" to "+s.field1+"\n";
		else if(!field2.equals(s.field2)) str+="Field2: "+field2+" to "+s.field2+"\n";
		else if(!notes.equals(s.notes)) str+="Notes: "+notes+" to "+s.notes+"\n";
		else if(!order1.equals(s.order1)) str+="Order1: "+order1+" to "+s.order1+"\n";
		else if(!order1Pay.equals(s.order1Pay)) str+="Order1Pay: "+order1Pay+" to "+s.order1Pay+"\n";
		else if(!order2.equals(s.order2)) str+="Order2: "+order2+" to "+s.order2+"\n";
		else if(!order2Pay.equals(s.order2Pay)) str+="Order2Pay: "+order2Pay+" to "+s.order2Pay+"\n";
		return str;
	}
	public void printStudent()
	{
		System.out.println("Ref: "+ref+", First: "+first+", Last"+last+", ID: "+ID+", Grade: "+grade+", Hr: "+homeroom
				+"\nTrack: "+track+", Photo: "+photo+", Field1: "+field1+", Field2: "+field2+", Notes: "+notes
				+"\nOrder1: "+order1+", Order1Pay: "+order1Pay+", Order2: "+order2+", Order2Pay: "+order2Pay);
	}
	
}

