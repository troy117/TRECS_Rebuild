package photo.software.admin;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import javax.swing.JOptionPane;
import photo.software.student.Student;

public class OrderTalley 
{
	public ArrayList<Student> students;
	public String outputPath, school;
	public OrderTalley(ArrayList<Student> students, String outputPath, String school)
	{
		this.students = students;
		this.outputPath = outputPath;
		this.school = school;
		orderReport();
	}
	public void orderReport()
	{
		int students=0,photographed=0,paid=0;
		String grade;
		ArrayList<String> orders = new ArrayList<String>();
		for(Student s:this.students)
		{
			grade = s.grade;
			if(!((grade.equals("EXMPT"))||(grade.equals("FAC"))||(grade.equals(""))||(grade.equals("13"))
					||(grade.equals("14"))||(grade.equals("15"))))
			{
				students++;
				if(s.photo.equals("true")) photographed++;
				if(s.order1Pay.equals("true"))
				{
					paid++;
					orders.add(s.order1);
				}
				if(s.order2Pay.equals("true"))
				{
					paid++;
					orders.add(s.order2);
				}
			}
			else if(grade.equals("EXMPT"))
			{
				if(s.order1Pay.equals("true"))
				{
					paid++;
					orders.add(s.order1);
				}
				if(s.order2Pay.equals("true"))
				{
					paid++;
					orders.add(s.order2);
				}
			}
		}
		parseOrders(orders, students, photographed, paid);
		
	}
	private void parseOrders(ArrayList<String> orders, int students, int photographed, int paid)
	{
		
		int o1=0,o2=0,o3=0,o4=0,o5=0,o6=0,o7=0,o8=0,o9=0,o10=0,
			o11=0,o12=0,o13=0,
			o21=0,o22=0,o23=0,o24=0,o25=0,o26=0,o27=0,o28=0,o29=0,
			o30=0,o31=0,o32=0,
			o40=0,o41=0,o42=0,o43=0,o44=0,o45=0,o49=0,
			o51=0,o52=0,o53=0,
			o60=0,o61=0,o62=0,o63=0,o64=0,o65=0,o66=0,o67=0,o68=0,o69=0,
			o74=0,o79=0,
			o80=0,o84=0,o85=0,o86=0,o87=0,o88=0,o89=0,
			o91=0,o92=0,o93=0,o94=0,o98=0,o99=0,
			o101=0;
				
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
				else if(t.equals("6")) o6++;
				else if(t.equals("7")) o7++;
				else if(t.equals("8")) o8++;
				else if(t.equals("9")) o9++;
				else if(t.equals("10")) o10++;
				else if(t.equals("11")) o11++;
				else if(t.equals("12")) o12++;
				else if(t.equals("13")) o13++;
				else if(t.equals("21")) o21++;
				else if(t.equals("22")) o22++;
				else if(t.equals("23")) o23++;
				else if(t.equals("24")) o24++;
				else if(t.equals("25")) o25++;
				else if(t.equals("26")) o26++;
				else if(t.equals("27")) o27++;
				else if(t.equals("28")) o28++;
				else if(t.equals("29")) o29++;
				else if(t.equals("30")) o30++;
				else if(t.equals("31")) o31++;
				else if(t.equals("32")) o32++;
				else if(t.equals("40")) o40++;
				else if(t.equals("41")) o41++;
				else if(t.equals("42")) o42++;
				else if(t.equals("43")) o43++;
				else if(t.equals("44")) o44++;
				else if(t.equals("45")) o45++;
				else if(t.equals("49")) o49++;
				else if(t.equals("51")) o51++;
				else if(t.equals("52")) o52++;
				else if(t.equals("53")) o53++;
				else if(t.equals("60")) o60++;
				else if(t.equals("61")) o61++;
				else if(t.equals("62")) o62++;
				else if(t.equals("63")) o63++;
				else if(t.equals("64")) o64++;
				else if(t.equals("65")) o65++;
				else if(t.equals("66")) o66++;
				else if(t.equals("67")) o67++;
				else if(t.equals("68")) o68++;
				else if(t.equals("69")) o69++;
				else if(t.equals("74")) o74++;
				else if(t.equals("79")) o79++;
				else if(t.equals("80")) o80++;
				else if(t.equals("84")) o84++;
				else if(t.equals("85")) o85++;
				else if(t.equals("86")) o86++;
				else if(t.equals("87")) o87++;
				else if(t.equals("88")) o88++;
				else if(t.equals("89")) o89++;
				else if(t.equals("91")) o91++;
				else if(t.equals("92")) o92++;
				else if(t.equals("93")) o93++;
				else if(t.equals("94")) o94++;
				else if(t.equals("98")) o98++;
				else if(t.equals("99")) o99++;
				else if(t.equals("101")) o101++;
			}
		}
		try 
		{
			PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter(outputPath+"\\OrderReport.txt",true)));
			out.println("School\tStudents\tPhotographed\tPaid\t\t1\t2\t3\t4\t5\t6\t7\t8\t9\t10\t11\t12\t13\t21\t22\t23\t24\t25\t26\t27\t28\t29\t30\t31\t32"
					+ "\t40\t41\t42\t43\t44\t45\t49\t51\t52\t53\t60\t61\t62\t63\t64\t65\t66\t67\t68\t69\t74\t79\t80\t84\t85\t86\t87\t88\t89\t91\t92\t93\t94\t98\t99\t101");
			out.println(school+"\t"+students+"\t"+photographed+"\t"+paid+"\t\t"+o1+"\t"+o2+"\t"+o3+"\t"+o4
					+ "\t"+o5+"\t"+o6+"\t"+o7+"\t"+o8+"\t"+o9
					+ "\t"+o10+"\t"+o11+"\t"+o12+"\t"+o13
					+ "\t"+o21+"\t"+o22+"\t"+o23+"\t"+o24+"\t"+o25+"\t"+o26+"\t"+o27+"\t"+o28+"\t"+o29
					+ "\t"+o30+"\t"+o31+"\t"+o32
					+ "\t"+o40+"\t"+o41+"\t"+o42+"\t"+o43+"\t"+o44+"\t"+o45+"\t"+o49
					+ "\t"+o51+"\t"+o52+"\t"+o53
					+ "\t"+o60+"\t"+o61+"\t"+o62+"\t"+o63+"\t"+o64+"\t"+o65+"\t"+o66+"\t"+o67+"\t"+o68+"\t"+o69
					+ "\t"+o74+"\t"+o79
					+ "\t"+o80+"\t"+o84+"\t"+o85+"\t"+o86+"\t"+o87+"\t"+o88+"\t"+o89
					+ "\t"+o91+"\t"+o92+"\t"+o93+"\t"+o94+"\t"+o98+"\t"+o99
					+ "\t"+o101);
			out.close();
			JOptionPane.showMessageDialog(null, "Done: "+outputPath+"\\OrderReport.txt");
		} catch (IOException e1) {JOptionPane.showMessageDialog(null, "Error Tallying Orders");}
	}
}

