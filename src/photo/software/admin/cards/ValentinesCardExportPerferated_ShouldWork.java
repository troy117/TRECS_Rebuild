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


public class ValentinesCardExportPerferated_ShouldWork implements Runnable
{
	
	BufferedImage bImage, eImage, stuImage, tImage, tEnvelope;
	BufferedImage envelope, teachImage;
	BufferedImage[] vImage;
	Graphics2D g, bG, eG,tG;
	File largeImage;
	Image img, resized;
	int fontSize, width;
	FontMetrics fm;
	ArrayList<Student> students;
	ArrayList<Homeroom> homerooms;
	String imageFolder, outputFolder, medImageFolder, school, envelopeText;
	Student currentStudent;
	PrintWriter log;
	boolean bagLabels, teacherEnvelopes, cards;
	String studentEnvelopes;
	int cardCount,totalStudents;
	HolidayCardGUI gui;
	
	public ValentinesCardExportPerferated_ShouldWork(HolidayCardGUI gui, ArrayList<Student> students, String outputFolder, String schoolPath, String schoolName)
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
	public void setValues(String text, boolean teacherEnvelopes, String studentEnvelopes, boolean cards)
	{
		this.envelopeText = text;
		this.teacherEnvelopes = teacherEnvelopes;
		this.studentEnvelopes = studentEnvelopes;
		this.cards = cards;
	}
	public void run() 
	{
		
		initializeBackgrounds();
		
		logger("");
		
		if(teacherEnvelopes) renderTeacherEnvelope();
		if(!studentEnvelopes.equals("")) renderStudentEnvelope();
		if(cards) createCards();
	}

	private void renderTeacherEnvelope()
	{
		logger("Starting Teacher Envelopes...");
		gui.updateProgressBar(0, "Teacher Envelopes");
		new File(outputFolder+"\\TeacherEnvelopes").mkdir();
		tEnvelope = new BufferedImage(3000,3900,BufferedImage.TYPE_INT_RGB);
		tG = tEnvelope.createGraphics();
		int count = 0, hCount = 0;

		for(Homeroom h:homerooms)
		{
			tG.setColor(Color.white);
			tG.fillRect(0, 0, 3000, 3900);
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
			try{
				ImageIO.write(tEnvelope, "jpg", new File(outputFolder+"\\TeacherEnvelopes\\"+h.getHomeroom()+"_"+hCount+".jpg"));
			}
			catch(Exception e){JOptionPane.showMessageDialog(null, "Error Creating Teacher Envelope: "+e);}
			hCount++;
			gui.updateProgressBar((hCount*100)/homerooms.size(), "Teacher Envelope: " + h.getHomeroom());
		}
		tEnvelope.flush();
		tEnvelope = null;
		logger(homerooms.size()+" Teacher Envelopes Created!");
		logger("");
		gui.updateProgressBar(100, "Teacher Envelopes Complete!");
	}
	private void renderStudentEnvelope()
	{
		try
		{
			logger("Starting Student Envelopes...");
			gui.updateProgressBar(0, "Student Envelopes");
			new File(outputFolder+"\\StudentEnvelopes").mkdir();
			
			envelope = ImageIO.read(new File("Templates\\Valentine\\"+studentEnvelopes));
			eImage = new BufferedImage(2625,3975,BufferedImage.TYPE_INT_RGB);
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
						eG.fillRect(0, 0, 2625, 3975);
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
	
	private void initializeBackgrounds()
	{
		vImage = new BufferedImage[9];
		logger("Initializing Holiday Templates...");
		try 
		{
			vImage[0] = ImageIO.read(new File("Templates\\Valentine\\ValentineK-3_1.png"));
			logger("Background Valentine 0: Student ValentineK-3_1.png");
			vImage[1] = ImageIO.read(new File("Templates\\Valentine\\ValentineK-3_2.png"));
			logger("Background Valentine 1: Student ValentineK-3_2.png");
			vImage[2] = ImageIO.read(new File("Templates\\Valentine\\ValentineK-3_3.png"));
			logger("Background Valentine 2: Student ValentineK-3_3.png");
			vImage[3] = ImageIO.read(new File("Templates\\Valentine\\ValentineK-3_4.png"));
			logger("Background Valentine 3: Student ValentineK-3_4.png");
			vImage[4] = ImageIO.read(new File("Templates\\Valentine\\Valentine4-6_1.png"));
			logger("Background Valentine 4: Student Valentine4-6_1.png");
			vImage[5] = ImageIO.read(new File("Templates\\Valentine\\Valentine4-6_2.png"));
			logger("Background Valentine 5: Student Valentine4-6_2.png");
			vImage[6] = ImageIO.read(new File("Templates\\Valentine\\Valentine4-6_3.png"));
			logger("Background Valentine 6: Student Valentine4-6_3.png");
			vImage[7] = ImageIO.read(new File("Templates\\Valentine\\Valentine4-6_4.png"));
			logger("Background Valentine 7: Student Valentine4-6_4.png");
			vImage[8] = ImageIO.read(new File("Templates\\Valentine\\ValentineFAC.png"));
			logger("Background Valentine 7: Student ValentineFAC.png");
			
		} catch (Exception e1) 
		{
			JOptionPane.showMessageDialog(null, "Error Opening Template: "+e1);
			logger("Background Valentine ERROR!");
		}
		logger("Valentine Templates loaded!");
	}
	private void createCards()
	{
		logger("Creating Holiday Cards...");
		new File(outputFolder+"\\Cards").mkdir();
		
		int vCard = 0, stuCount = 0, sheetsPerHomeroom=0;
	
		bImage = new BufferedImage(3300,5100,BufferedImage.TYPE_INT_RGB);
		bG = bImage.createGraphics();
		tImage = new BufferedImage(3300,5100,BufferedImage.TYPE_INT_RGB);
		tG = tImage.createGraphics();
	
		for(Homeroom h:homerooms)
		{
			sheetsPerHomeroom=3;
			if(h.totalSize()>30) sheetsPerHomeroom=4;
			
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
						
						bG.drawImage(resized, 80, 80, null);
						bG.drawImage(resized, 80, 1100, null);
						bG.drawImage(resized, 80, 2120, null);
						bG.drawImage(resized, 80, 3140, null);
						bG.drawImage(resized, 80, 4160, null);
						bG.drawImage(resized, 1740, 80, null);
						bG.drawImage(resized, 1740, 1100, null);
						bG.drawImage(resized, 1740, 2120, null);
						bG.drawImage(resized, 1740, 3140, null);
						bG.drawImage(resized, 1740, 4160, null);
						resized.flush();
						resized = null;
						
						if(s.grade.equals("FAC"))
						{
							bG.drawImage(vImage[8],0,0,null);
							for(int i=0;i<sheetsPerHomeroom;i++)
							{
								ImageIO.write(bImage, "jpg", new File(outputFolder+"\\Cards\\"+s.homeroom+"_0_"+s.last+"_"+s.first+"_"+String.format("%05d", vCard)+".jpg"));
								vCard++;
							}
						}
						else if(s.grade.equals("PRE")||s.grade.equals("TK")||s.grade.equals("KIN")||s.grade.equals("01")||s.grade.equals("02")||s.grade.equals("03"))
						{
							for(int i=0;i<sheetsPerHomeroom;i++)
							{
								tG.drawImage(bImage, 0, 0, null);
								tG.drawImage(vImage[i], 0, 0, null);
								ImageIO.write(tImage, "jpg", new File(outputFolder+"\\Cards\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+String.format("%05d", vCard)+".jpg"));
								vCard++;
							}
						}
						else
						{
							for(int i=0;i<sheetsPerHomeroom;i++)
							{
								tG.drawImage(bImage, 0, 0, null);
								tG.drawImage(vImage[i+4], 0, 0, null);
								ImageIO.write(tImage, "jpg", new File(outputFolder+"\\Cards\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+String.format("%05d", vCard)+".jpg"));
								vCard++;
							}
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
		tImage.flush();
		tImage = null;

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
