package photo.software.admin.cards;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.comparators.StudentClassSortComparator;
import photo.software.composites.Homeroom;
import photo.software.student.Student;


public class ValentinesCardExportPerferated implements Runnable
{
	
	BufferedImage bImage, eImage, stuImage, tImage, tEnvelope;
	BufferedImage envelope, teachImage;
	BufferedImage[] vImage;
	Graphics2D g, bG, eG,tG, lG;
	File largeImage;
	Image img, resized;
	int fontSize, width;
	FontMetrics fm;
	ArrayList<Student> students;
	ArrayList<Homeroom> homerooms;
	String imageFolder, outputFolder, medImageFolder, school, envelopeText;
	Student currentStudent;
	PrintWriter log;
	boolean bagLabels, teacherEnvelopes, cards, labels;
	String studentEnvelopes;
	int cardCount,totalStudents;
	HolidayCardGUI gui;
	
	public ValentinesCardExportPerferated(HolidayCardGUI gui, ArrayList<Student> students, String outputFolder, String schoolPath, String schoolName)
	{
		this.gui = gui;
		this.students = students;
		imageFolder = schoolPath+"\\CroppedLarge";
		medImageFolder = schoolPath+"\\CroppedMed";
		school = schoolName;
		this.outputFolder = outputFolder;
		
		homerooms = new ArrayList<Homeroom>();
		Collections.sort(students, new StudentClassSortComparator());
		totalStudents=0;
		for(Student s:students)
		{
			if((!s.homeroom.equals(""))
					&&(!s.last.equals(""))
					&&(!s.first.equals(""))
					&&(!s.grade.equals("EXMPT"))
					&&(s.photo.toUpperCase().equals("TRUE")))
			{
				addToHomeroom(s);
				totalStudents++;
			}
		}
		logger("");
	}
	/**
	 * 
	 * @param text Text to be added to the Envelope
	 * @param teacherEnvelopes boolean if teacher envelopes should be run
	 * @param studentEnvelopes string with name of envelope to use
	 * @param cards boolean if valentine cards should be run
	 */
	public void setValues(String text, boolean teacherEnvelopes, String studentEnvelopes, boolean cards, boolean labels)
	{
		this.envelopeText = text;
		this.teacherEnvelopes = teacherEnvelopes;
		this.studentEnvelopes = studentEnvelopes;
		this.cards = cards;
		this.labels = labels;
	}
	public void run() 
	{
		if(teacherEnvelopes) renderTeacherEnvelope();
		if(!studentEnvelopes.equals("")) renderStudentEnvelope();
		if(cards) createCards();
		if(labels) renderBagLabels();
	}

	private void renderTeacherEnvelope()
	{
		try
		{
			logger("Starting Teacher Envelopes...");
			gui.updateProgressBar(0, "Teacher Envelopes");
			new File(outputFolder+"\\TeacherEnvelopes").mkdir();
			tEnvelope = new BufferedImage(3000,3900,BufferedImage.TYPE_INT_RGB);
			BufferedImage footer = ImageIO.read(new File("Templates\\Valentine\\TeacherEnvelopeFooter.jpg"));
			tG = tEnvelope.createGraphics();
			int count = 0, hCount = 0;
	
			for(Homeroom h:homerooms)
			{
				tG.setColor(Color.white);
				tG.fillRect(0, 0, 3000, 3900);
				tG.drawImage(footer, 0, 3300, null);
				tG.setColor(Color.black);
				tG.setFont(new Font("Arial", Font.BOLD, 100));
				tG.drawString("Room: "+h.getHomeroom(), 350, 750);
				tG.drawString("School: "+school, 350, 900);
				tG.setFont(new Font("Arial", Font.PLAIN, 100));
				tG.drawString(envelopeText, 350, 1025);
				///Start of table///
				tG.setFont(new Font("Arial", Font.PLAIN, 50));
				tG.drawLine(300, 1100, 2700, 1100);
				tG.drawString("Count", 310, 1160);
				tG.drawString("First", 610, 1160);
				tG.drawString("Last", 1110, 1160);
				tG.drawString("Purchased", 1810, 1160);
				tG.drawString("Returned", 2310, 1160);
				tG.drawLine(300, 1170, 2700, 1170);
				ArrayList<Student> current = h.getStudentsAndStaff();
				for(int i=0;i<h.totalSize();i++)
				{
					tG.drawString(""+(i+1), 310, 1160+((i+1)*70));
					tG.drawString(current.get(i).first, 610, 1160+((i+1)*70));
					tG.drawString(current.get(i).last, 1110, 1160+((i+1)*70));
					tG.drawLine(300, 1170+((i+1)*70), 2700, 1170+((i+1)*70));
					count = i;
				}
				tG.drawLine(300, 1100, 300, 1240+(count*70));
				tG.drawLine(600, 1100, 600, 1240+(count*70));
				tG.drawLine(1100, 1100, 1100, 1240+(count*70));
				tG.drawLine(1800, 1100, 1800, 1240+(count*70));
				tG.drawLine(2300, 1100, 2300, 1240+(count*70));
				tG.drawLine(2700, 1100, 2700, 1240+(count*70));
				
				
				
				ImageIO.write(tEnvelope, "jpg", new File(outputFolder+"\\TeacherEnvelopes\\"+h.getHomeroom()+"_"+hCount+".jpg"));
				
				
				hCount++;
				gui.updateProgressBar((hCount*100)/homerooms.size(), "Teacher Envelope: " + h.getHomeroom());
			}
			tEnvelope.flush();
			tEnvelope = null;
			logger(homerooms.size()+" Teacher Envelopes Created!");
			logger("");
			gui.updateProgressBar(100, "Teacher Envelopes Complete!");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Creating Teacher Envelope: "+e);}
	}
	private void renderBagLabels()
	{
		try
		{
			logger("Starting Bag Labels...");
			gui.updateProgressBar(0, "Bag Labels");
			BufferedImage classLabel = ImageIO.read(new File("Templates\\Valentine\\ClassLabel.jpg"));
			BufferedImage lImage = new BufferedImage(1200,600,BufferedImage.TYPE_INT_RGB);
			lG = lImage.createGraphics();
			lG.setColor(Color.black);
			int count = 0;
			new File(outputFolder+"\\TeacherBagLabels").mkdir();
			for(Homeroom h:homerooms)
			{
				lG.drawImage(classLabel,0,0,null);
				lG.setFont(new Font("Arial", Font.BOLD, 150));
				printSimpleString(h.getHomeroom(), 1100, 50, 420);
				lG.setFont(new Font("Arial", Font.BOLD, 100));
				printSimpleString(school, 1100, 50, 550);

				ImageIO.write(lImage, "jpg", new File(outputFolder+"\\TeacherBagLabels\\"+h.getHomeroom()+"_"+count+".jpg"));
				count++;
			}
			lImage.flush();
			lImage = null;
			classLabel.flush();
			classLabel = null;
			logger("Finished Creating "+count+" Bag Labels for "+homerooms.size()+" homerooms!");
			logger("");
			gui.updateProgressBar(100, "Bag Labels Complete!");
		}
		catch(Exception e)
		{
			JOptionPane.showMessageDialog(null, "Error Creating Teacher Bag Label: "+e);
			logger("Error creating Bag Labels: "+e.getMessage());
		}	
	}
	private void renderStudentEnvelope()
	{
		try
		{
			logger("Starting Student Envelopes...");
			gui.updateProgressBar(0, "Student Envelopes");
			new File(outputFolder+"\\StudentEnvelopes").mkdir();
			
			envelope = ImageIO.read(new File("Templates\\Valentine\\"+studentEnvelopes));
			eImage = new BufferedImage(2640,3960,BufferedImage.TYPE_INT_RGB);
			eG = eImage.createGraphics();
			
			File medImage;
			int i = 0;
			for(Homeroom h:homerooms)
			{
				ArrayList<Student> current = h.getStudentsAndStaff();
				for(Student s:current)
				{
					medImage = new File(medImageFolder+"\\"+s.ref+".jpg");
					if(medImage.exists())
					{
						gui.updateProgressBar((i*100)/totalStudents, "Student Envelope: "+s.homeroom+": "+s.first+" "+s.last);
						eG.setColor(Color.white);
						eG.fillRect(0, 0, 2640, 3960);
						eG.drawImage(envelope, 0, 0, null);
						stuImage = ImageIO.read(medImage);
						eG.drawImage(stuImage.getScaledInstance(-1, 750, Image.SCALE_SMOOTH), 100,740,null);
						stuImage.flush();
						stuImage = null;
						eG.setColor(Color.black);
						///////First and Last Name///////
						fontSize = 140;
						eG.setFont(new Font("Arial",Font.PLAIN,fontSize));
						fm = eG.getFontMetrics();
						width = fm.stringWidth(s.first+" "+s.last);
						
						while(width>1500)
						{
							fontSize--;
							eG.setFont(new Font("Arial",Font.PLAIN,fontSize));
							fm = eG.getFontMetrics();
							width = fm.stringWidth(s.first+" "+s.last);
						}
						eG.drawString(s.first+" "+s.last, 800, 840);
						
						///////Grade & Homeroom///////
						fontSize = 80;
						eG.setFont(new Font("Arial",Font.PLAIN,fontSize));
						fm = eG.getFontMetrics();
						width = fm.stringWidth(s.grade+": "+s.homeroom);
						
						while(width>1500)
						{
							fontSize--;
							eG.setFont(new Font("Arial",Font.PLAIN,fontSize));
							fm = eG.getFontMetrics();
							width = fm.stringWidth(s.grade+": "+s.homeroom);
						}
						eG.drawString(s.grade+": "+s.homeroom, 800, 940);
						
						///////School Name///////
						fontSize = 80;
						eG.setFont(new Font("Arial",Font.PLAIN,fontSize));
						fm = eG.getFontMetrics();
						width = fm.stringWidth(school);
						
						while(width>1500)
						{
							fontSize--;
							eG.setFont(new Font("Arial",Font.PLAIN,fontSize));
							fm = eG.getFontMetrics();
							width = fm.stringWidth(school);
						}
						eG.drawString(school, 800, 1040);
						
						///////Barcode///////
						fontSize = 50;
						eG.setFont(new Font("Arial",Font.PLAIN,fontSize));
						eG.drawString("Ref Num: "+s.ref, 100, 1540);
						eG.setFont(new Font("Code39FiveText",Font.PLAIN,90));
						eG.drawString("*"+s.ref+"*", 100, 1640);		
						
						
						//////Vertical Teacher Name//////
						eG.rotate(Math.PI/2);
						eG.setFont(new Font("Arial",Font.PLAIN,80));
						eG.drawString(s.grade+": "+s.homeroom, 740, -2500);
						eG.rotate(-Math.PI/2);

						if(s.grade.equals("FAC")) ImageIO.write(eImage, "jpg", new File(outputFolder+"\\StudentEnvelopes\\"+s.homeroom+"_0_"+s.last+"_"+s.first+"_"+i+".jpg"));
						else ImageIO.write(eImage, "jpg", new File(outputFolder+"\\StudentEnvelopes\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+i+".jpg"));
						i++;
					}
				}
			}
			eImage.flush();
			eImage = null;
			System.gc();
			logger(i + " Student Envelopes Created!");
			logger("");
			gui.updateProgressBar(100, "Student Envelopes Complete!");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error creating envelope: "+e);}
		
	}
	
	private void createCards()
	{
		logger("Creating Holiday Cards...");
		new File(outputFolder+"\\Cards").mkdir();
		String temp;
		int vCard = 0, stuCount = 0, sph=0;
	
		bImage = new BufferedImage(3300,5100,BufferedImage.TYPE_INT_RGB);
		bG = bImage.createGraphics();
		for(Homeroom h:homerooms)
		{
			sph=3;
			if(h.totalSize()>30) sph=4;
			
			ArrayList<Student> current = h.getStudentsAndStaff();
			for(Student s:current)
			{
				if(new File(imageFolder+"\\"+s.ref+".jpg").exists())
				{
					try
					{
						gui.updateProgressBar((stuCount*100)/totalStudents, "Cards: "+h.getHomeroom()+": "+s.first+" "+s.last);
						bG.setColor(Color.white);
						bG.fillRect(0, 0, 3300, 5100);
						
						stuImage = ImageIO.read(new File(imageFolder+"\\"+s.ref+".jpg"));
						resized = stuImage.getScaledInstance(670,-1,Image.SCALE_SMOOTH);
						stuImage.flush();
						stuImage = null;
						
						bG.drawImage(resized, 95, 80, null);
						bG.drawImage(resized, 95, 1100, null);
						bG.drawImage(resized, 95, 2120, null);
						bG.drawImage(resized, 95, 3140, null);
						bG.drawImage(resized, 95, 4160, null);
						bG.drawImage(resized, 1744, 80, null);
						bG.drawImage(resized, 1744, 1100, null);
						bG.drawImage(resized, 1744, 2120, null);
						bG.drawImage(resized, 1744, 3140, null);
						bG.drawImage(resized, 1744, 4160, null);
						resized.flush();
						resized = null;
						
						temp = s.homeroom+"_"+s.last+"_"+s.first+"_"+String.format("%05d", vCard)+".jpg";
						if(s.grade.equals("FAC"))
						{
							temp = s.homeroom+"_0_"+s.last+"_"+s.first+"_"+String.format("%05d", vCard)+".jpg";
							ImageIO.write(bImage, "jpg", new File(outputFolder+"\\Cards\\"+temp));
							cardWriter(temp+"\t0\t"+sph+"\t"+vCard+"\t"+s.homeroom+"_0_"+s.last+"_"+s.first);
							vCard+=sph;
							
						}
						else if(s.grade.equals("PRE")||s.grade.equals("TK")||s.grade.equals("KIN")||s.grade.equals("01")||s.grade.equals("02")||s.grade.equals("03"))
						{
							ImageIO.write(bImage, "jpg", new File(outputFolder+"\\Cards\\"+temp));
							cardWriter(temp+"\t1\t"+sph+"\t"+vCard+"\t"+s.homeroom+"_"+s.last+"_"+s.first);
							vCard+=sph;
						}
						else
						{
							ImageIO.write(bImage, "jpg", new File(outputFolder+"\\Cards\\"+temp));
							cardWriter(temp+"\t2\t"+sph+"\t"+vCard+"\t"+s.homeroom+"_"+s.last+"_"+s.first);
							vCard+=sph;
						}
						stuCount++;
				
					}catch(Exception e)
					{
						JOptionPane.showMessageDialog(null, "Error: "+e);
						logger("Error: "+s.homeroom+": "+s.first+" "+s.last+": "+e);
					}
				}
			}
		}
		bImage.flush();
		bImage = null;

		gui.updateProgressBar(100, "Student Cards Complete!");
	}

	public void logger(String line)
	{
		try
		{
			log = new PrintWriter(new BufferedWriter(new FileWriter(outputFolder+"\\log.txt",true)));
			log.println(line);
    		log.close();
		}catch(Exception e){}
	}
	public void cardWriter(String line)
	{
		try
		{
			log = new PrintWriter(new BufferedWriter(new FileWriter(outputFolder+"\\Cards\\Valentine.txt",true)));
			log.println(line);
    		log.close();
		}catch(Exception e){}
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
	private void printSimpleString(String s, int width, int xPos, int yPos)
	{
		int stringLen = (int)lG.getFontMetrics().getStringBounds(s, lG).getWidth();
		while(stringLen>width)
		{
			lG.setFont(new Font(lG.getFont().getFontName(),lG.getFont().getStyle(),lG.getFont().getSize()-2));
			stringLen = (int)lG.getFontMetrics().getStringBounds(s, lG).getWidth();
		}
		int start = width/2 - stringLen/2;
		lG.drawString(s,start+xPos, yPos);
	}
}
