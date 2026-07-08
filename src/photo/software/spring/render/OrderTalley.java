package photo.software.spring.render;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import javax.swing.JOptionPane;

import photo.software.spring.SpringStudent;

public class OrderTalley 
{
	public ArrayList<SpringStudent> students;
	public String outputPath, school;
	public OrderTalley(ArrayList<SpringStudent> students, String outputPath, String school)
	{
		this.students = students;
		this.outputPath = outputPath;
		this.school = school;
		orderReport();
	}
	public void orderReport()
	{
		int studentCount=0;
		ArrayList<String> orders = new ArrayList<String>();
		for(SpringStudent s:students)
		{
			if(!((s.grade.equals("EXMPT"))||(s.grade.equals("FAC"))||(s.grade.equals(""))||(s.grade.equals("13"))
					||(s.grade.equals("14"))||(s.grade.equals("15"))))
			{
				studentCount++;
			}
			orders.add(s.order1);
			orders.add(s.order2);
		}
		parseOrders(studentCount,orders);
		
	}
	private void parseOrders(int studentCount, ArrayList<String> orders)
	{
		
		int o1=0,o2=0,o3=0,o4=0,o5=0,
			o21=0,o22=0,o23=0,o24=0,o25=0,o26=0,o27=0,
			o31=0,o32=0,o33=0,o34=0,o35=0,o36=0,o37=0,o38=0,
			o41=0,o42=0,o43=0,
			o98=0,o99=0;
				
		for(String o: orders)
		{
			String[] order = o.split("\\.");
			for(String t: order)
			{
				if(t.equals("1")) o1++;
				else if(t.equals("2")) o2++;
				else if(t.equals("3")) o3++;
				else if(t.equals("4")) o4++;
				else if(t.equals("5")) o5++;
				else if(t.equals("21")) o21++;
				else if(t.equals("22")) o22++;
				else if(t.equals("23")) o23++;
				else if(t.equals("24")) o24++;
				else if(t.equals("25")) o25++;
				else if(t.equals("26")) o26++;
				else if(t.equals("27")) o27++;
				else if(t.equals("31")) o31++;
				else if(t.equals("32")) o32++;
				else if(t.equals("33")) o33++;
				else if(t.equals("34")) o34++;
				else if(t.equals("35")) o35++;
				else if(t.equals("36")) o36++;
				else if(t.equals("37")) o37++;
				else if(t.equals("38")) o38++;
				else if(t.equals("41")) o41++;
				else if(t.equals("42")) o42++;
				else if(t.equals("43")) o43++;
				else if(t.equals("98")) o98++;
				else if(t.equals("99")) o99++;
			}
		}
		try 
		{
			PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(outputPath+"\\"+school+"\\OrderReport.txt",true)));
			out.println("School\tStudents\tPhotographed\t\t1\t2\t3\t4\t5\t21\t22\t23\t24\t25\t26\t27"
					+ "\t31\t32\t33\t34\t35\t36\t37\t38\t41\t42\t43\t98\t99");
			out.println(school+"\t"+studentCount+"\t"+students.size()+"\t\t"+o1+"\t"+o2+"\t"+o3+"\t"+o4
					+ "\t"+o5 +"\t"+o21+"\t"+o22+"\t"+o23+"\t"+o24+"\t"+o25+"\t"+o26+"\t"+o27
					+ "\t"+o31+"\t"+o32+"\t"+o33+"\t"+o34+"\t"+o35+"\t"+o36+"\t"+o37+"\t"+o38
					+ "\t"+o41+"\t"+o42+"\t"+o43+"\t"+o98+"\t"+o99);
			out.close();
		} catch (IOException e1) {JOptionPane.showMessageDialog(null, "Error Tallying Orders");}
	}
}

