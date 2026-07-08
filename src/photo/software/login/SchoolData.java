package photo.software.login;

public class SchoolData 
{
	public String refNum, schoolName, trecsName, phone, address, city, state, zipcode, 
			c1Name, c1Position, c1Email,c2Name, c2Position, c2Email, c3Name, c3Position, c3Email,
			notes;
	public SchoolData(String refNum, String schoolName, String trecsName, 
			String phone, String address, String city, String state, String zipcode,
			String c1Name, String c1Position, String c1Email, String c2Name, String c2Position, String c2Email,
			String c3Name, String c3Position, String c3Email, String notes)
	{
		this.refNum = refNum;
		this.schoolName = schoolName;
		this.trecsName = trecsName;
		this.phone = phone;
		this.address = address;
		this.city = city;
		this.state = state;
		this.zipcode = zipcode;
		this.c1Name = c1Name;
		this.c1Position = c1Position;
		this.c1Email = c1Email;
		this.c2Name = c2Name;
		this.c2Position = c2Position;
		this.c2Email = c2Email;
		this.c3Name = c3Name;
		this.c3Position = c3Position;
		this.c3Email = c3Email;
		this.notes = notes;
	}
	public SchoolData(String refNum, String trecsName)
	{
		this.refNum = refNum;
		this.schoolName = "";
		this.trecsName = trecsName;
		this.phone = "";
		this.address = "";
		this.city = "";
		this.state = "";
		this.zipcode = "";
		this.c1Name = "";
		this.c1Position = "";
		this.c1Email = "";
		this.c2Name = "";
		this.c2Position = "";
		this.c2Email = "";
		this.c3Name = "";
		this.c3Position = "";
		this.c3Email = "";
		this.notes = "";
	}
}
