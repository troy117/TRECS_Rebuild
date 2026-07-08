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
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.comparators.StudentClassSortComparator;
import photo.software.composites.Homeroom;
import photo.software.student.Student;


public class ValentinesCardExport implements Runnable
{
	public static int STU_IMG_X = 140, STU_IMG_Y = 100, STU_IMG_W = 700;
	BufferedImage bImage, stuImage;
	int vCard = 0, stuCount = 0;
	BufferedImage[] vImage = new BufferedImage[36];
	BufferedImage[] tImage = new BufferedImage[9];
	Graphics2D bG, tG, lG;
	File largeImage;
	Image img, resized;
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
	
	public ValentinesCardExport(HolidayCardGUI gui, ArrayList<Student> students, String outputFolder, String schoolPath, String schoolName)
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
		cardCount = 0;
		for(Homeroom h:homerooms)
		{
			for(Student s:h.getStudentsAndStaff())
			{
				if(new File(imageFolder+"\\"+s.ref+".jpg").exists())
				{
					if(h.totalSize()<28) cardCount+=27;
					else cardCount+=36;
				}
			}
		}
		logger("Students: "+totalStudents+", Homerooms: "+homerooms.size()+", Cards: "+cardCount);
		logger("");
	}
	public void setValues(String text, boolean bagLabels, boolean teacherEnvelopes, String studentEnvelopes, boolean cards)
	{
		this.envelopeText = text;
		this.bagLabels =  bagLabels;
		this.teacherEnvelopes = teacherEnvelopes;
		this.studentEnvelopes = studentEnvelopes;
		this.cards = cards;
	}
	public void run() {
	    try 
	    {
	        if (bagLabels) renderBagLabels();
	        if (Thread.currentThread().isInterrupted()) return; // Check for interruption

	        if (teacherEnvelopes) renderTeacherEnvelope();
	        if (Thread.currentThread().isInterrupted()) return;

	        if (!studentEnvelopes.equals("")) renderStudentEnvelope();
	        if (Thread.currentThread().isInterrupted()) return;

	        if (cards) createCards();
	    } catch (Exception e) {
	        Thread.currentThread().interrupt(); // Restore interrupted status
	        System.out.println("Rendering interrupted.");
	    }
	    System.out.println("ValentinesCardExport completed.");
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
				if(h.totalSize()>27)
				{
					ImageIO.write(lImage, "jpg", new File(outputFolder+"\\TeacherBagLabels\\"+h.getHomeroom()+"_"+count+".jpg"));
					count++;
				}
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
	private void renderTeacherEnvelope()
	{
		logger("Starting Teacher Envelopes...");
		gui.updateProgressBar(0, "Teacher Envelopes");
		new File(outputFolder+"\\TeacherEnvelopes").mkdir();
		BufferedImage tEnvelope = new BufferedImage(3000,3900,BufferedImage.TYPE_INT_RGB);
		Graphics2D tG = tEnvelope.createGraphics();
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
			
			BufferedImage eImage = ImageIO.read(new File("Templates\\Valentine\\"+studentEnvelopes));
			Graphics2D eG = eImage.createGraphics();
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
						eG.fillRect(0, 1740, 1800, 640);
						stuImage = ImageIO.read(medImage);
						Image resized = stuImage.getScaledInstance(-1, 600, Image.SCALE_SMOOTH);
						stuImage.flush();
						stuImage = null;
						eG.drawImage(resized, 50,1760,null);
						resized.flush();
						resized = null;
						eG.setColor(Color.black);
						eG.setFont(new Font("Arial",Font.BOLD,70));
						eG.drawString(s.first+" "+s.last, 550, 1860);
						eG.setFont(new Font("Arial",Font.BOLD,50));
						eG.drawString("Room: "+s.homeroom, 550, 1960);
						eG.drawString("Grade: "+s.grade, 550, 2060);
						eG.drawString("School: "+school, 550, 2160);
						eG.setFont(new Font("Bar Code 39 f",Font.PLAIN,75));
						eG.drawString("*"+s.ref+"*", 550, 2340);
						eG.setFont(new Font("Arial",Font.BOLD,50));
						ImageIO.write(eImage, "jpg", new File(outputFolder+"\\StudentEnvelopes\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+i+".jpg"));
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
	/**
	 * This function initializes all 36 Student and all 9 Teacher valentine png templates.
	 * Usually this crashes in JAVA and only runs in Eclipse for some dumb reason I have been unable to figure out.
	 */
	private void initializeBackgrounds()
	{
		try 
		{
			for(int i=0;i<36;i++)
			{
				vImage[i] = ImageIO.read(new File("Templates\\Valentine\\V"+(i+1)+".png"));
				logger("Background index: "+i+", file: V"+(i+1));
			}
			for(int i=0;i<9;i++)
			{
				tImage[i] = ImageIO.read(new File("Templates\\Valentine\\T"+(i+1)+".png"));
				logger("Background index: "+i+", file: T"+(i+1));
			}
		} catch (IOException e1) {JOptionPane.showMessageDialog(null, "Error Opening Template: "+e1);}
	}
	/**
	 * This functions renders the individual cards used in the createCards() function
	 * @param i Valentine Card index number
	 * @param s Student Information used to create card & export name
	 * @param staff Boolean decides which template is used when creating card, student or staff
	 * @throws IOException Exception thrown when fails to save card
	 */
	private void createCard(int i, Student s, Boolean staff) throws IOException
	{
		bG.fillRect(0, 0, 1800, 1200);
		bG.drawImage(resized, STU_IMG_X, STU_IMG_Y, null);
		if(staff) bG.drawImage(tImage[i%9], 0, 0, null);
		else bG.drawImage(vImage[i],0,0,null);
		ImageIO.write(bImage, "jpg", new File(outputFolder+"\\Cards\\"+s.homeroom+"_"+s.last+"_"+s.first+"_"+String.format("%05d", vCard)+".jpg"));
		bImage.flush();
		bImage = new BufferedImage(1800,1200,BufferedImage.TYPE_INT_RGB);
		bG = bImage.createGraphics();
		vCard++;
	}
	/**
	 * This function creates all the cards for the all students passed into the class constructor
	 */
	private void createCards()
	{
		logger("Initializing Holiday Templates...");
		initializeBackgrounds();
		logger("Valentine Templates loaded!");
		logger("");
		
		logger("Creating Holiday Cards...");
		new File(outputFolder+"\\Cards").mkdir();
		
		vCard = 0;
		stuCount = 0;
		
		for(Homeroom h:homerooms)
		{
			ArrayList<Student> current = h.getStudentsAndStaff();
			for(Student s:current)
			{
				if(new File(imageFolder+"\\"+s.ref+".jpg").exists())
				{
					try
					{
						gui.updateProgressBar((stuCount*100)/totalStudents, "Cards: "+h.getHomeroom()+": "+s.first+" "+s.last);
						
						bImage = new BufferedImage(1800,1200,BufferedImage.TYPE_INT_RGB);
						bG = bImage.createGraphics();
						stuImage = ImageIO.read(new File(imageFolder+"\\"+s.ref+".jpg"));
						resized = stuImage.getScaledInstance(STU_IMG_W,-1,Image.SCALE_SMOOTH);
						bG.setColor(Color.white);
						if(s.grade.equals("FAC"))
						{
							if(h.totalSize()<28) for(int i=0;i<27;i++) createCard(i, s, true);
							else for(int i=0;i<36;i++) createCard(i, s, true);
						}
						else
						{
							if(h.totalSize()<28) for(int i=0;i<27;i++) createCard(i, s, false);
							else for(int i=0;i<36;i++) createCard(i, s, false);
						}
						stuCount++;
						stuImage.flush();
						stuImage = null;
						resized.flush();
						resized = null;
						bImage.flush();
						bImage = null;
					}catch(Exception e)
					{
						JOptionPane.showMessageDialog(null, "Error: "+e);
						logger("Error: "+s.homeroom+": "+s.first+" "+s.last+": "+e);
					}
				}
			}
		}
		for(int i=0;i<36;i++)
		{
			vImage[i].flush();
			vImage[i] = null;
		}
		for(int i=0;i<9;i++)
		{
			tImage[i].flush();
			tImage[i] = null;
		}
		logger(vCard+" Valentine Cards Complete for "+stuCount+" Students!");
		logger("");
		
		stackCutter();
		gui.updateProgressBar(100, "Student Cards Complete!");
	}
	private void stackCutter()
	{
		File folder = new File(outputFolder+"\\Cards\\");
		File[] images = folder.listFiles(new FilenameFilter(){
			public boolean accept(File dir, String name){
				return name.toUpperCase().endsWith(".JPG");
			}
		});
		ArrayList<File> imageList = new ArrayList<File>();
		for(File f:images) imageList.add(f);
		Collections.sort(imageList);
		int div = (imageList.size()+(8))/9;
		int index=0;
		int prefix=0;
		for(int i=0;i<9;i++)
		{
			for(int j=0;j<div;j++)
			{
				index = (i*div)+(j);
				prefix = (j*9)+(i);
				
				if(index<imageList.size())
				{
					imageList.get(index).renameTo(new File(folder.getAbsolutePath()+"\\"+String.format("%05d", prefix)+"_"+imageList.get(index).getName()));
				}
			}
		}
		logger("Stack Cut Maker Done!");
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

	public void logger(String line)
	{
		try
		{
			log = new PrintWriter(new BufferedWriter(new FileWriter(outputFolder+"\\log.txt",true)));
			log.println(line);
    		log.close();
		}catch(Exception e){}
	}
	/**
	 * This function adds a student to existing Homeroom ArrayList or creates a new Homeroom ArrayList inside of homerooms
	 * @param s Student to be added to a Homeroom
	 */
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
