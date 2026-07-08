package photo.software.admin;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.comparators.StudentClassSortComparator;
import photo.software.composites.Homeroom;
import photo.software.student.Student;

public class LibraryBookCreator 
{
	String output, imageFolder, schoolName;
	ArrayList<Homeroom> homerooms;
	int page, fontSize, width;
	BufferedImage bImage, img;
	Graphics2D bG;
	Font header;
	FontMetrics fm;
	
	public LibraryBookCreator(ArrayList<Student> students, String output, String imageFolder, String schoolName)
	{
		this.output = output;
		this.imageFolder = imageFolder;
		this.schoolName = schoolName;
		header = new Font("Arial",Font.PLAIN,120);
		
		homerooms = new ArrayList<Homeroom>();
		Collections.sort(students, new StudentClassSortComparator());
		for(Student s:students)
		{
			if((!s.homeroom.equals(""))
					&&(!s.last.equals(""))
					&&(!s.first.equals(""))
					&&(!s.grade.equals("EXMPT"))) addToHomeroom(s);
		}
		generateLibraryBook();
	}
	private void generateLibraryBook()
	{
		try
		{
			bImage = ImageIO.read(new File("Templates\\FALL\\Library_Cover.jpg"));
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			fontSize = 300;
			bG.setFont(new Font("Myriad Pro", Font.PLAIN, fontSize));
			page = 0;
			
			FontMetrics fm = bG.getFontMetrics();
			width = fm.stringWidth(schoolName);
			while(width>2100)
			{
				fontSize--;
				bG.setFont(new Font("Myriad Pro", Font.PLAIN, fontSize));
				fm = bG.getFontMetrics();
				width = fm.stringWidth(schoolName);
			}
			bG.drawString(schoolName, (1350-(width/2)), 600);
			ImageIO.write(bImage, "jpg", new File(output+"\\Library_"+schoolName+"_"+page+".jpg"));
			page++;
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error Proccessing: "+e);}
		
		for(Homeroom h:homerooms)
		{
			if(h.totalStudents()<37)
			{
				render36Lib(h);
			}
			else if(h.totalStudents()<43)
			{
				render42Lib(h);
			}
		}
	}

	private void addHeader(Graphics2D g, String homeroom)
	{
		g.setColor(Color.black);
		g.setFont(header);
		FontMetrics m = g.getFontMetrics();
		int w = m.stringWidth(homeroom);
		g.drawString(homeroom, (1275-(w/2)), 375);
	}
	private void render36Lib(Homeroom h)
	{
		try
		{
			bImage = new BufferedImage(2550,3300,BufferedImage.TYPE_INT_RGB);
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 2550, 3300);
			
			addHeader(bG,h.getHomeroom());
			
			ArrayList<Student> homeroomStudents = h.getStudents();
			if(h.totalStudents()<19)
			{
				ImageIO.write(bImage, "jpg", new File(output+"\\Library_"+schoolName+"_"+page+".jpg"));
				page++;

				for(int i=0;i<homeroomStudents.size();i++)
				{		
					cell18(homeroomStudents.get(i),i);
				}
				ImageIO.write(bImage, "jpg", new File(output+"\\Library_"+schoolName+"_"+page+".jpg"));
				page++;
			}
			else
			{	
				for(int i=0;i<18;i++)
				{
					cell18(homeroomStudents.get(i),i);
				}
				ImageIO.write(bImage, "jpg", new File(output+"\\Library_"+schoolName+"_"+page+".jpg"));
				page++;
				
				bG.setColor(Color.white);
				bG.fillRect(0, 450, 2550, 2850);
				bG.setColor(Color.black);
				
				for(int i=18;i<homeroomStudents.size();i++)
				{
					cell18(homeroomStudents.get(i),i);
				}
				ImageIO.write(bImage, "jpg", new File(output+"\\Library_"+schoolName+"_"+page+".jpg"));
				page++;
			}
			bImage.flush();
			bImage = null;
			System.gc();
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error in render36Lib: "+e);}
	}
	
	private void render42Lib(Homeroom h)
	{
		try
		{
			bImage = new BufferedImage(2550,3300,BufferedImage.TYPE_INT_RGB);
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 2550, 3300);
			
			addHeader(bG,h.getHomeroom());
			
			ArrayList<Student> homeroomStudents = h.getStudents();
			for(int i=0;i<21;i++)
			{
				cell21(homeroomStudents.get(i),i);
			}
			ImageIO.write(bImage, "jpg", new File(output+"\\Library_"+schoolName+"_"+page+".jpg"));
			page++;
			
			bG.setColor(Color.white);
			bG.fillRect(0, 450, 2550, 2850);
			bG.setColor(Color.black);
			for(int i=21;i<homeroomStudents.size();i++)
			{
				cell21(homeroomStudents.get(i),i);
			}
			ImageIO.write(bImage, "jpg", new File(output+"\\Library_"+schoolName+"_"+page+".jpg"));
			page++;

			bImage.flush();
			bImage = null;
			System.gc();
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error in render36Lib: "+e);}
	}
	
	private void cell21(Student s, int position)
	{
		int col[] = {150,900,1650};
		int row[] = {450,825,1200,1575,1950,2325,2700};
		if(s.photo.equals("true"))
		{
			try
			{
				img = ImageIO.read(new File(imageFolder+"\\"+s.ref+".jpg"));
				bG.drawImage(img.getScaledInstance(-1, 250, Image.SCALE_SMOOTH),col[(position%21)%3],row[(position%21)/3],null);
			}catch(Exception e){JOptionPane.showMessageDialog(null,"Error opening student: "+e+"\n"+s.ref);}
		}
		bG.setFont(new Font("Arial",Font.PLAIN,50));
		writer(s.first,col[(position%21)%3]+250,row[(position%21)/3]+70,450,50);
		writer(s.last,col[(position%21)%3]+250,row[(position%21)/3]+130,450,50);
		writer("Grade: "+s.grade,col[(position%21)%3]+250,row[(position%21)/3]+200,450,30);
		writer("ID: "+s.ID,col[(position%21)%3]+250,row[(position%21)/3]+240,450,30);
		bG.setFont(new Font("Bar Code 39 d",Font.PLAIN,70));
		writer("*"+s.ID+"*",col[(position%21)%3],row[(position%21)/3]+330,700,70);
		
	}
	
	private void cell18(Student s, int position)
	{
		int col[] = {150,900,1650};
		int row[] = {450,900,1350,1800,2250,2700};
		if(s.photo.equals("true"))
		{
			try
			{
				img = ImageIO.read(new File(imageFolder+"\\"+s.ref+".jpg"));
				bG.drawImage(img.getScaledInstance(-1, 300, Image.SCALE_SMOOTH),col[(position%18)%3],row[(position%18)/3],null);
			}catch(Exception e){JOptionPane.showMessageDialog(null,"Error opening student: "+e+"\n"+s.ref);}
		}
		bG.setFont(new Font("Arial",Font.PLAIN,50));
		writer(s.first,col[(position%18)%3]+265,row[(position%18)/3]+70,450,50);
		writer(s.last,col[(position%18)%3]+265,row[(position%18)/3]+130,450,50);
		writer("Grade: "+s.grade,col[(position%18)%3]+265,row[(position%18)/3]+260,450,30);
		writer("ID: "+s.ID,col[(position%18)%3]+265,row[(position%18)/3]+300,450,30);
		bG.setFont(new Font("Bar Code 39 d",Font.PLAIN,70));
		writer("*"+s.ID+"*",col[(position%18)%3],row[(position%18)/3]+390,700,70);
		
	}
	private void writer(String info, int x, int y, int width, int size)
	{
		String f = bG.getFont().getFontName();
		bG.setFont(new Font(f,Font.PLAIN,size));
		
		int tempSize = size;
		FontMetrics fm = bG.getFontMetrics();
		while(fm.stringWidth(info) > width)
		{
			tempSize--;
			bG.setFont(new Font(f,Font.PLAIN,tempSize));
			fm = bG.getFontMetrics();
		}
		bG.drawString(info, x, y);
	}
	private void addToHomeroom(Student s)
	{
		Boolean exists = false;
		for(Homeroom h: homerooms)
		{
			if(h.getHomeroom().equals(s.homeroom))
			{
				exists = true;
				h.addStudent(s);
				return;
			}
		}if(!exists)
		{
			homerooms.add(new Homeroom(s.homeroom));
			for(Homeroom h:homerooms)
			{
				if(h.getHomeroom().equals(s.homeroom)) h.addStudent(s);
			}
		}
	}
	
}
