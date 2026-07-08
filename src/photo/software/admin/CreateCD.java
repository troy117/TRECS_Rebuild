package photo.software.admin;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;

import org.apache.commons.io.FileUtils;

import photo.software.comparators.StudentLastNameSortComparator;
import photo.software.student.Student;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;


public class CreateCD 
{
	private ArrayList<Student> students;
	private String dir, schoolName;
	public CreateCD(ArrayList<Student> input, String schoolDir, String schoolName)
	{
		students = input;
		dir = schoolDir;
		this.schoolName = schoolName;
		
	}
	public void cdLabel(String type)
	{
		try
		{
			
			BufferedImage bImage;
			if(type.equals("Admin")) bImage = ImageIO.read(new File("Templates\\FALL\\CD_COVER_Admin.jpg"));
			else if(type.equals("Library")) bImage = ImageIO.read(new File("Templates\\FALL\\CD_COVER_Library.jpg"));
			else if(type.equals("Group")) bImage = ImageIO.read(new File("Templates\\FALL\\CD_COVER_Group.jpg"));
			else  bImage = ImageIO.read(new File("Templates\\FALL\\CD_COVER_Yearbook.jpg"));
			Graphics2D g = bImage.createGraphics();
			g.setColor(Color.black);
			if(type.equals("Yearbook")) g.setColor(Color.white);
			int fontSize = 100, width;
			g.setFont(new Font("Myriad Pro", Font.PLAIN, fontSize));
			FontMetrics fm = g.getFontMetrics();
			width = fm.stringWidth(schoolName);
			while(width>880)
			{
				fontSize--;
				g.setFont(new Font("Myriad Pro", Font.PLAIN, fontSize));
				fm = g.getFontMetrics();
				width = fm.stringWidth(schoolName);
			}
			g.drawString(schoolName, 1275-(width/2), 380);
			g.setStroke(new BasicStroke(3));
			g.drawLine(1275-(width/2), 390, 1275+(width/2), 390);
			new File(dir+"\\Exports").mkdir();
			ImageIO.write(bImage, "jpg", new File(dir+"\\Exports\\"+type+"_CD_Label.jpg"));
			g.dispose();
			bImage.flush();
			bImage = null;
			
			if(type.equals("Admin")) bImage = ImageIO.read(new File("Templates\\FALL\\CD_ENV_Admin.jpg"));
			else if(type.equals("Library")) bImage = ImageIO.read(new File("Templates\\FALL\\CD_ENV_Library.jpg"));
			else if(type.equals("Group")) bImage = ImageIO.read(new File("Templates\\FALL\\CD_ENV_Group.jpg"));
			else  bImage = ImageIO.read(new File("Templates\\FALL\\CD_ENV_Yearbook.jpg"));
			g = bImage.createGraphics();
			g.setColor(Color.black);
			if(type.equals("Yearbook")) g.setColor(Color.white);
			
			fontSize = 140;
			g.setFont(new Font("Myriad Pro", Font.PLAIN, fontSize));
			fm = g.getFontMetrics();
			width = fm.stringWidth(schoolName);
			while(width>1000)
			{
				fontSize--;
				g.setFont(new Font("Myriad Pro", Font.PLAIN, fontSize));
				fm = g.getFontMetrics();
				width = fm.stringWidth(schoolName);
			}
			g.drawString(schoolName, 741-(width/2), 710);
			g.setStroke(new BasicStroke(3));
			g.drawLine(741-(width/2), 715, 741+(width/2), 715);
			new File(dir+"\\Exports").mkdir();
			ImageIO.write(bImage, "jpg", new File(dir+"\\Exports\\"+type+"_PAPER_CD_Envelope.jpg"));
			g.dispose();
			bImage.flush();
			bImage = null;
			
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Creating "+type+" CD Cover: "+e);}
	}
	public void ybCD(boolean largeImg)
	{
		//Bunch of stuff to figure out for this one...
		File in,out;
		try {
			new File(dir+"\\Exports\\YB_CD_IMAGES\\VOL1\\FOLDER1").mkdirs();
			PrintWriter found = new PrintWriter(dir+"\\Exports\\YB_CD_IMAGES\\VOL1\\Index.txt","UTF-8");
			PrintWriter readme= new PrintWriter(dir+"\\Exports\\YB_CD_IMAGES\\VOL1\\Readme.txt","UTF-8");
			readme.println("[Image Size] = Standard");
			readme.println("[Color Model] = RGB");
			readme.println("[School Name = "+dir.substring(dir.lastIndexOf("\\")+1));
			readme.println("[# Fields] = 10");
			readme.println("[Field Definition #1] = VOLUME NAME");
			readme.println("[Field Definition #2] = IMAGE FOLDER");
			readme.println("[Field Definition #3] = FILENAME");
			readme.println("[Field Definition #4] = GRADE");
			readme.println("[Field Definition #5] = LNAME");
			readme.println("[Field Definition #6] = FNAME");
			readme.println("[Field Definition #7] = ROOM");
			readme.println("[Field Definition #8] = PERIOD");
			readme.println("[Field Definition #9] = TEACHER");
			readme.println("[Field Definition #10] = TEACHERPRIORITY");
			readme.close();
			int count = 1;
			for(Student s:students)
			{
				if((!s.last.equals(""))&&(!s.first.equals("")))
				{
					if(s.photo.equals("true"))
					{
						try
						{
							//Copy and rename image to count.jpg
							//Copy image to folder
							if(largeImg) in = new File(dir+"\\CroppedLarge\\"+s.ref+".jpg");
							else in = new File(dir+"\\CroppedMed\\"+s.ref+".jpg");
							out = new File(dir+"\\Exports\\YB_CD_IMAGES\\VOL1\\FOLDER1\\"+String.format("%05d", count)+".jpg");
							FileUtils.copyFile(in, out);
							if(s.grade=="FAC") found.println("VOL1\tFOLDER1\t"+String.format("%05d", count)+".jpg\t"+s.grade+"\t"
							+s.last+"\t"+s.first+"\t"+s.homeroom+"\t\t"+s.homeroom+"\t"+1);
							else found.println("VOL1\tFOLDER1\t"+String.format("%05d", count)+".jpg\t"+s.grade+"\t"
									+s.last+"\t"+s.first+"\t"+s.homeroom+"\t\t"+s.homeroom+"\t"+0);
							
						}catch(Exception e)
						{
							JOptionPane.showMessageDialog(null, "Error copying image?: "+s.ref+" "+e);
						}
						count++;
					}
					
				}
			}
			found.close();
		} catch (Exception e){JOptionPane.showMessageDialog(null, "Error creating Yearbook cd: "+e);}

	}
	public void yearbookCD(boolean largeImg)
	{
		//Bunch of stuff to figure out for this one...
		File in,out;
		try {
			new File(dir+"\\Exports\\YEARBOOK").mkdirs();
			PrintWriter found = new PrintWriter(dir+"\\Exports\\YEARBOOK\\XREFPICT.txt","UTF-8");
			int count = 1;
			for(Student s:students)
			{
				if((!s.last.equals(""))&&(!s.first.equals("")))
				{
					if(s.photo.equals("true"))
					{
						try
						{
							//Copy and rename image to count.jpg
							//Copy image to folder
							if(largeImg) in = new File(dir+"\\CroppedLarge\\"+s.ref+".jpg");
							else in = new File(dir+"\\CroppedMed\\"+s.ref+".jpg");
							out = new File(dir+"\\Exports\\YEARBOOK\\"+count+".jpg");
							FileUtils.copyFile(in, out);
							found.println(s.first+"\t"+s.last+"\t"+s.grade+"\t"+String.format("%05d", count));
							
						}catch(Exception e)
						{
							JOptionPane.showMessageDialog(null, "Error copying image?: "+s.ref+" "+e);
						}
						count++;
					}
					
				}
			}
			found.close();
		} catch (Exception e){JOptionPane.showMessageDialog(null, "Error creating Yearbook cd: "+e);}

	}
	public void studentCD()
	{
		//STUDENT_CD_IMAGES folder
		//All images are saved as IDNum.jpg
		//Exception.txt file saved in folder, format already prepped 140x175
		//IDLINK.TXT
		File in,out;
		try {
			new File(dir+"\\Exports\\STUDENT_CD_IMAGES").mkdirs();
			PrintWriter except = new PrintWriter(dir+"\\Exports\\STUDENT_CD_IMAGES\\Exceptions.txt", "UTF-8");
			PrintWriter found = new PrintWriter(dir+"\\Exports\\STUDENT_CD_IMAGES\\IDLINK.txt","UTF-8");
			Collections.sort(students, new StudentLastNameSortComparator());
			for(Student s:students)
			{
				if((!s.last.equals(""))&&(!s.first.equals("")))
				{
					if(s.ID.equals("")) except.println("No Student ID 1: "+s.ref+" - "+ s.last+", "+s.first);
					if(!s.photo.equals("true")) except.println("No Image: "+s.ref+" - "+ s.last+", "+s.first+" - ID: "+s.ID);
					if((!s.ID.equals(""))&&(s.photo.equals("true")))
					{
						try
						{
							//Copy image to folder
							in = new File(dir+"\\CroppedMed\\"+s.ref+".jpg");
							out = new File(dir+"\\Exports\\STUDENT_CD_IMAGES\\"+s.ID+".jpg");
							FileUtils.copyFile(in, out);
							found.println("\""+s.ID+"\",\""+s.ID+".jpg\",\""+s.last+"\",\""+s.first+"\",\""+s.grade+"\"");
							
						}catch(Exception e)
						{
							JOptionPane.showMessageDialog(null, "Error copying image?: "+s.ref+" "+e);
							except.println("No Image: "+s.ref+" - "+ s.last+", "+s.first+" - ID: "+s.ID);
						}
					}
					
				}
			}
			except.close();
			found.close();
		} catch (Exception e){JOptionPane.showMessageDialog(null, "Error creating Student cd: "+e);}

	}
	public void destiny()
	{
		//STUDENT_CD_IMAGES folder
		//All images are saved as IDNum.jpg
		//Exception.txt file saved in folder, format already prepped 140x175
		//IDLINK.TXT
		File in,out;
		try {
			new File(dir+"\\Exports\\DESTINY").mkdirs();
			PrintWriter except = new PrintWriter(dir+"\\Exports\\DESTINY\\Exceptions.txt", "UTF-8");
			PrintWriter found = new PrintWriter(dir+"\\Exports\\DESTINY\\IDLINK.txt","UTF-8");
			Collections.sort(students, new StudentLastNameSortComparator());
			for(Student s:students)
			{
				if((!s.last.equals(""))&&(!s.first.equals("")))
				{
					if(s.ID.equals("")) except.println("No Student ID 1: "+s.ref+" - "+ s.last+", "+s.first);
					if(!s.photo.equals("true")) except.println("No Image: "+s.ref+" - "+ s.last+", "+s.first+" - ID: "+s.ID);
					if((!s.ID.equals(""))&&(s.photo.equals("true")))
					{
						try
						{
							//Copy image to folder
							in = new File(dir+"\\CroppedMed\\"+s.ref+".jpg");
							out = new File(dir+"\\Exports\\DESTINY\\"+s.ID+".jpg");
							FileUtils.copyFile(in, out);
							found.println("\""+s.ID+"\",\""+s.ID+".jpg\"");
							
						}catch(Exception e)
						{
							JOptionPane.showMessageDialog(null, "Error copying image?: "+s.ref+" "+e);
							except.println("No Image: "+s.ref+" - "+ s.last+", "+s.first+" - ID: "+s.ID);
						}
					}
					
				}
			}
			except.close();
			found.close();
		} catch (Exception e){JOptionPane.showMessageDialog(null, "Error creating Student cd: "+e);}

	}
	public void powerschool()
	{
		//STUDENT_CD_IMAGES folder
		//All images are saved as IDNum.jpg
		//Exception.TXT file saved in folder
		//MAP.TXT
		//Images 200x300
		File in,out;
		try {
			new File(dir+"\\Exports\\POWERSCHOOL_CD_IMAGES").mkdirs();
			PrintWriter except = new PrintWriter(dir+"\\Exports\\POWERSCHOOL_CD_IMAGES\\Exceptions.TXT", "UTF-8");
			PrintWriter found = new PrintWriter(dir+"\\Exports\\POWERSCHOOL_CD_IMAGES\\MAP.TXT","UTF-8");
			Collections.sort(students, new StudentLastNameSortComparator());
			for(Student s:students)
			{
				if((!s.last.equals(""))&&(!s.first.equals("")))
				{
					if(s.ID.equals("")) except.println("No Student ID 1: "+s.ref+" - "+ s.last+", "+s.first);
					if(!s.photo.equals("true")) except.println("No Image: "+s.ref+" - "+ s.last+", "+s.first+" - ID: "+s.ID);
					if((!s.ID.equals(""))&&(s.photo.equals("true")))
					{
						try
						{
							//Copy image to folder
							in = new File(dir+"\\CroppedMed\\"+s.ref+".jpg");
							out = new File(dir+"\\Exports\\POWERSCHOOL_CD_IMAGES\\"+s.ID+".jpg");
							FileUtils.copyFile(in, out);
							found.println(s.ID+"\t"+s.ID+".jpg");
							
						}catch(Exception e)
						{
							JOptionPane.showMessageDialog(null, "Error copying image?: "+s.ref+" "+e);
							except.println("No Image: "+s.ref+" - "+ s.last+", "+s.first+" - ID: "+s.ID);
						}
					}
					
				}
			}
			except.close();
			found.close();
		} catch (Exception e){JOptionPane.showMessageDialog(null, "Error creating Student cd: "+e);}

	}
	public void SASI()
	{
		//SASI_CD_IMAGES is the folder where everything is saved
		//DATAMAC is where both text files are saved
		//PCTFILEC is where the images are saved, Exception images are saved in this folder, but are not renamed to their id numbers
		//Resolution is 96x134
		File in,out;
		try {
			new File(dir+"\\Exports\\SASI_CD_IMAGES\\DATAMAC").mkdirs();
			new File(dir+"\\Exports\\SASI_CD_IMAGES\\PCTFILEC\\Exceptions").mkdirs();
			PrintWriter except = new PrintWriter(dir+"\\Exports\\SASI_CD_IMAGES\\DATAMAC\\Exceptions.txt", "UTF-8");
			PrintWriter found = new PrintWriter(dir+"\\Exports\\SASI_CD_IMAGES\\DATAMAC\\XREFPICT.txt","UTF-8");
			found.println("\"\",\".JPG\"");
			for(Student s:students)
			{
				if((!s.last.equals(""))&&(!s.first.equals("")))
				{
					if(s.ID.equals(""))
					{
						except.println("No Student ID 1: "+s.ref+" - "+ s.last+", "+s.first);
						try
						{
							in = new File(dir+"\\CroppedMed\\"+s.ref+".jpg");
							out = new File(dir+"\\Exports\\SASI_CD_IMAGES\\PCTFILEC\\Exceptions\\"+s.ref+".jpg");
							FileUtils.copyFile(in, out);
						}catch(IOException e){}
					}
					if(!s.photo.equals("true")) except.println("No Image: "+s.ref+" - "+ s.last+", "+s.first+" - ID: "+s.ID);
					if((!s.ID.equals(""))&&(s.photo.equals("true")))
					{
						try
						{
							//Copy image to folder
							in = new File(dir+"\\CroppedMed\\"+s.ref+".jpg");
							out = new File(dir+"\\Exports\\SASI_CD_IMAGES\\PCTFILEC\\"+s.ID+".jpg");
							FileUtils.copyFile(in, out);
							found.println("\""+String.format("%010d", Integer.parseInt(s.ID))+"\",\""+s.ID+".jpg\"");
							
						}catch(IOException e)
						{
							JOptionPane.showMessageDialog(null, "Error copying image, image should exist: "+s.ref+" "+e);
							except.println("No Image: "+s.ref+" - "+ s.last+", "+s.first+" - ID: "+s.ID);
						}
					}
				}
			}
			except.close();
			found.close();
		} catch (Exception e){JOptionPane.showMessageDialog(null, "Error creating SASI cd: "+e);}
		
	}
}
