package photo.software.render;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.RenderingHints;
import java.awt.Transparency;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Scanner;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import org.apache.commons.io.FileUtils;

import photo.software.comparators.OrderUnitStudentClassSortComparator;
import photo.software.comparators.OrderUnitStudentGradeSortComparator;
import photo.software.comparators.OrderUnitStudentLastNameSortComparator;
import photo.software.login.BatchOrderGUI;
import photo.software.login.JobData;
import photo.software.login.SchoolData;
import photo.software.orders.plans.PackagePlan;
import photo.software.render.addons.ButtonGenerator;
import photo.software.render.addons.CDEnvelopeGenerator;
import photo.software.render.addons.CDGenerator;
import photo.software.render.addons.QRCodeGenerator;
import photo.software.spring.render.RenderSpringOrderGUI;
import java.util.zip.*;

public class RenderOrders implements Runnable
{
	private ArrayList<RenderOrder> renderList, labels, envelopes, largeEnvelopes, cds, zip, ids, group5x7s, group8x10s, tenXthirteens, smileCollection, smileMagnets, digital, buttons;
	private RenderOrderGUI fallGUI;
	private RenderSpringOrderGUI springGUI;
	private RenderSeniorGUI seniorGUI;
	private BatchOrderGUI batchGUI;
	int sortBy, totalCodes, unitCount;
	private Font font, font2, barcode;
	private String renderPath, batchName;
	private JobData job;
		
	private File renderOutput;
	private SchoolData schoolData;
	private RenderOrder currentOrder;
	private ArrayList<PackagePlan> allPlans;
	private ArrayList<String> borders;
	private boolean includeUnits, includeAddons,includeEnvelopes, composites, borderBoolean, orderLabels,photoshopRender;
	private boolean closed = false;
	private PrintWriter log;
	
	/////////////////////////RENDER ////////////////////
	private BufferedImage bImage, stuImage, tempImage;
	private Graphics2D g, gResult, gDimg;
	FontMetrics fm;
	Rectangle2D rect;
	/**
	 * 
	 * @param schoolData SchoolData provides school name for excel report, null if batch
	 * @param renderList All Students to be rendered
	 * @param allPlans All Package Plans, narrowed down for individual schools to reduce iteration
	 * @param fallGUI Fall GUI used for progress bar
	 * @param springGUI Spring GUI used for progress bar
	 * @param renderPath output path for everything to be rendered
	 * @param sortBy sorting
	 * @param incUnits boolean render out units
	 * @param incAddons boolean render out add ons
	 * @param incEnvelopes boolean render out envelopes
	 * @param batchName batch name
	 */
	public RenderOrders(SchoolData schoolData, JobData job, ArrayList<RenderOrder> renderList, ArrayList<PackagePlan> allPlans, 
			RenderOrderGUI fallGUI, RenderSpringOrderGUI springGUI, BatchOrderGUI batchGUI, RenderSeniorGUI seniorGUI, String renderPath, int sortBy, 
			boolean incUnits, boolean incAddons, boolean incEnvelopes, String batchName, boolean composites, boolean orderLabels, boolean photoshopRender)
	{
		this.schoolData = schoolData;
		this.job = job;
		this.renderList = renderList;
		this.allPlans = allPlans;
		this.fallGUI = fallGUI;
		this.springGUI = springGUI;
		this.batchGUI = batchGUI;
		this.seniorGUI = seniorGUI;
		this.sortBy = sortBy;
		this.renderPath = renderPath;
		this.batchName = batchName;
		this.composites = composites;
		this.orderLabels = orderLabels;
		this.photoshopRender = photoshopRender;
		includeUnits = incUnits;
		includeAddons = incAddons;
		includeEnvelopes = incEnvelopes;

		if(sortBy==0) Collections.sort(this.renderList, new OrderUnitStudentLastNameSortComparator());
		else if(sortBy==1) Collections.sort(this.renderList, new OrderUnitStudentGradeSortComparator());
		else if(sortBy==2) Collections.sort(this.renderList, new OrderUnitStudentClassSortComparator());
		
		font = new Font("Arial",Font.PLAIN,60);
		font2 = new Font("Arial",Font.PLAIN,30);
		barcode = new Font("Code39FiveText",Font.PLAIN,75);

	}
	
	private void initializeBorders()
	{
		borders = new ArrayList<String>();
		try
		{

			File borderList = new File("TEMPLATES\\BORDERS.txt");
			String borderLine;
			if(borderList.exists())
			{
				Scanner borderScanner = new Scanner(borderList);
				while(borderScanner.hasNext())
				{
					borderLine = borderScanner.nextLine();
					if(!borderLine.contains("\\\\")) borders.add(borderLine);
					
				}
				borderScanner.close();
			}else JOptionPane.showMessageDialog(null, "ORDER_PREP_ITEMS.txt File does not exist!");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "ERROR WITH ORDER_PREP_ITEMS FILE!");}
	}
		
	public void run() 
	{
		closed = false;
		initializeBorders();
		if (Thread.currentThread().isInterrupted()) {return;}
		unitCount = 0;
		String folder;
		if(batchName.equals(""))
		{
			this.renderPath = this.renderPath+"\\"+this.schoolData.trecsName;
			renderOutput = new File(renderPath);
			renderOutput.mkdir();
		}
		else
		{
			this.renderPath = this.renderPath+"\\"+batchName;
			renderOutput = new File(renderPath);
			renderOutput.mkdir();
		}
		
		initializeArrayLists();
		String instructions="";

		for(int i=0;i<renderList.size();i++)
		{
			if (Thread.currentThread().isInterrupted()) {return;}
			currentOrder = renderList.get(i);
			if(photoshopRender)
			{
				folder = getSourceFolder();
				instructions+=processPhotoshop(folder);

			}
			else 
			{
				orderParser();
				processOrder();
				updateProgressBar(((i*100)/renderList.size()), "Units: "+currentOrder.first+" "+currentOrder.last);
			}
		}
		updateProgressBar(100, "Units Done!");
		if(schoolData!=null) new RenderExcelReport(schoolData,renderList,renderPath,sortBy);
		updateProgressBar(100, "Excel Done!");
		if(instructions!="")
		{
			try
			{
				FileWriter txtFile = new FileWriter(renderPath+"\\RenderInstructions.txt");
				txtFile.write(instructions);
				txtFile.close();
				
				updateProgressBar(100, "RenderInstructions Done!");
			}catch(Exception e) {JOptionPane.showMessageDialog(null, "Error: "+e);}
		}		
		if (Thread.currentThread().isInterrupted()) {return;}


		if(includeEnvelopes) if(!miscEnvelopesLabels()) return;
		if (Thread.currentThread().isInterrupted()) {return;}
		updateProgressBar(100, "Envelopes & Labels Done!");
		if(orderLabels) new RenderLabels(renderList,allPlans,renderPath+"\\Labels",this,sortBy);
		if (Thread.currentThread().isInterrupted()) {return;}
		if(includeAddons) 
		{
			processAddOns();
			miscDigital();
		}
		if (Thread.currentThread().isInterrupted()) {return;}
		
		updateProgressBar(100, "Starting Addons");
		//renderReport();

		updateProgressBar(100, "ALL COMPLETE!");
	}
	
	
	public void updateProgressBar(int percent, String text)
	{
		if(fallGUI!=null)
		{
			fallGUI.updateProgressBar(percent, text);
		}
		else if(springGUI!=null)
		{
			springGUI.updateProgressBar(percent, text);
		}
		else if(batchGUI!=null)
		{
			batchGUI.updateProgressBar(percent, text);
		}
		else if(seniorGUI!=null)
		{
			seniorGUI.updateProgressBar(percent, text);
		}
	}
	private void initializeArrayLists()
	{
		labels = new ArrayList<RenderOrder>();
		envelopes = new ArrayList<RenderOrder>();
		largeEnvelopes = new ArrayList<RenderOrder>();
		ids = new ArrayList<RenderOrder>();
		cds = new ArrayList<RenderOrder>();
		zip = new ArrayList<RenderOrder>();
		buttons = new ArrayList<RenderOrder>();
		group8x10s = new ArrayList<RenderOrder>();
		group5x7s = new ArrayList<RenderOrder>();
		tenXthirteens = new ArrayList<RenderOrder>();
		smileCollection = new ArrayList<RenderOrder>();
		smileMagnets = new ArrayList<RenderOrder>();
		digital = new ArrayList<RenderOrder>();
		
	}
	//Used to check if a particular border is needed
	private void orderParser()
	{
		boolean regularEnv = true;
		String codeNames = "";
		String[] codes=currentOrder.order.split("\\.");
		for(String c:codes)
		{
			for(PackagePlan p:allPlans)
			{
				if(currentOrder.plan.equals(p.plan)&&c.equals(p.code))
				{
					regularEnv &= true;
					p.updateCounts();
					if(p.getBigEnvelopeCount()>0) regularEnv &= false;
					codeNames+=p.name+", ";
					break;
				}
			}
		}
		if(codeNames.endsWith(", ")) codeNames = codeNames.substring(0,codeNames.length()-2);
		currentOrder.allItems = codeNames;
		if(regularEnv) envelopes.add(currentOrder);
		else largeEnvelopes.add(currentOrder); 
	}
	
	private String processPhotoshop(String folder)
	{
		boolean regularEnv = true;
		String[] codes = currentOrder.order.split("\\.");
		String codeNames = "";
		String txt = "";
		totalCodes=0;
		for(String c:codes)
		{
			totalCodes++;
			for(PackagePlan p: allPlans)
			{
				if(currentOrder.plan.equals(p.plan)&&c.equals(p.code))
				{
					regularEnv &= true;
					p.updateCounts();
					if(p.getBigEnvelopeCount()>0) regularEnv &= false;
					codeNames+=p.name+", ";
					txt += processPhotoshop(p,folder);
					break;
				}
			}
		}
		if(codeNames.endsWith(", ")) codeNames = codeNames.substring(0,codeNames.length()-2);
		currentOrder.allItems = codeNames;
		if(regularEnv) envelopes.add(currentOrder);
		else largeEnvelopes.add(currentOrder); 
		return txt;
	}
	
	private void processOrder()
	{
		String[] codes = currentOrder.order.split("\\.");
		totalCodes=0;
		for(String c:codes)
		{
			totalCodes++;
			for(PackagePlan p: allPlans)
			{
				if(currentOrder.plan.equals(p.plan)&&c.equals(p.code))
				{
					processPlan(p);
					break;
				}
			}
		}
	}
	

	
	private String getSourceFolder()
	{
		String[] codes=currentOrder.order.split("\\.");
		for(String c:codes)
		{
			for(PackagePlan p:allPlans)
			{
				if(currentOrder.plan.equals(p.plan) && c.equals(p.code))
				{
					for(String b:borders)
					{
						if(b.equals(p.name))
						{
							return b;
						}
					}
				}
			}
		}
		if(new File(currentOrder.jobFolder+"\\CroppedLargeWithBorder\\").exists()) return "CroppedLargeWithBorder";
		return "CroppedLarge";
	}
	
	private String processPhotoshop(PackagePlan plan, String folder)
	{
		String temp = "";
		String txtFile="";
		for(int i=0;i<15;i++)
		{
			temp = plan.f[i];
			if(!temp.equals(""))
			{
				if(temp.contains("Group5x7")) group5x7s.add(currentOrder);
				else if(temp.contains("Group8x10")) group8x10s.add(currentOrder);
				else if(temp.contains("ID")) ids.add(currentOrder);
				else if(temp.contains("DigitalDownload")) digital.add(currentOrder);
				else if(temp.contains("CD")) cds.add(currentOrder);
				else if(temp.contains("Zip")) zip.add(currentOrder);
				else if(temp.contains("Button")) buttons.add(currentOrder);
				else if(temp.equals("Smile Magnets")) smileMagnets.add(currentOrder);
				else if(temp.equals("Smile Collection")) smileCollection.add(currentOrder);
				else
				{
					String sort = "Student";
					switch (sortBy)
					{
						case 1: sort = currentOrder.grade;
						break;
						case 2: sort = currentOrder.homeroom;
						break;
					}
					
					if(temp.contains("Funpack")||temp.contains("Magnets")||temp.contains("Keychain")||temp.contains("ArtPrint")) folder = "CroppedLarge";
					
					txtFile += folder+"\t"+currentOrder.image+"\t"+currentOrder.schoolName+"\t"+temp+"\t"+sort+"\t"+currentOrder.last+"\t"+currentOrder.first+"\n";
					if(!new File(renderPath+"\\"+folder+"\\"+currentOrder.image).exists())
					{
						try {
							if(new File(currentOrder.jobFolder+"\\Borders\\"+folder+"\\"+currentOrder.image).exists())
								FileUtils.copyFile(new File(currentOrder.jobFolder+"\\Borders\\"+folder+"\\"+currentOrder.image), new File(renderPath+"\\"+folder+"\\"+currentOrder.image));
							else FileUtils.copyFile(new File(currentOrder.jobFolder+"\\"+folder+"\\"+currentOrder.image), new File(renderPath+"\\"+folder+"\\"+currentOrder.image));
						
						}catch(Exception e) {JOptionPane.showMessageDialog(null, "Error: "+e);}
					}
				}			
			}
		}
		return txtFile;
	}
	
	private void processPlan(PackagePlan plan)
	{
		String temp = "";
		for(int i=0;i<15;i++)
		{
			temp = plan.f[i];
			if(!temp.equals(""))
			{

				if(temp.contains("Group5x7")) group5x7s.add(currentOrder);
				else if(temp.contains("Group8x10")) group8x10s.add(currentOrder);
				
				else if(temp.contains("ID")) ids.add(currentOrder);
				else if(temp.contains("DigitalDownload"))
				{
					if(job.isSports())
					{
						String tempImgFolder = currentOrder.imgFolder;
						currentOrder.imgFolder = currentOrder.imgFolder.replace("CroppedLarge", "CroppedLargeWithBorder");
						digital.add(new RenderOrder(currentOrder));
						currentOrder.imgFolder = tempImgFolder;
					}
					else if(job.isSpring())
					{
						String tempImgFolder = currentOrder.imgFolder;
						currentOrder.imgFolder = currentOrder.jobFolder+"\\"+currentOrder.imgFolder.replace("CroppedLarge", "CroppedLargeWithBorder");
						digital.add(new RenderOrder(currentOrder));
						currentOrder.imgFolder = tempImgFolder;
					}
					else digital.add(currentOrder);
				}
				else if(temp.contains("CD")) cds.add(currentOrder);
				else if(temp.contains("Zip")) zip.add(currentOrder);
				else if(temp.contains("Button")) buttons.add(currentOrder);
				else if(temp.equals("Smile Magnets")) smileMagnets.add(currentOrder);
				else if(temp.equals("Smile Collection")) smileCollection.add(currentOrder);
				else if(temp.contains("10x13")) tenXthirteens.add(currentOrder);
				
				//Labels
				else if(temp.contains("Mug")
						||temp.contains("Plaque")
						||temp.contains("Waterbottle")){labels.add(currentOrder);}
				
				//Units
				else if(includeUnits)
				{
					createBackground();
					renderPage(temp);
				}
			}
		}
	}
	public boolean processAddOns()
	{
		miscGroup();
		if(closed) return false;
		miscIDCard();
		misc10x13();
		if(closed) return false;
		miscCDsZip();
		if(closed) return false;
		miscDigital();
		if(closed) return false;
		miscSmileCollection();
		if(closed) return false;
		miscSmileMagnets();
		if(closed) return false;
		miscButton();
		if(closed) return false;
		if(springGUI!=null) new AddOnPrep(renderList,allPlans,new File(renderPath),"Spring");
		else new AddOnPrep(renderList,allPlans,new File(renderPath),"");
		return true;
	}
	
	private void miscButton()
	{
		if(buttons.size()>0)
		{
			new File(renderPath+"\\Buttons").mkdir();
			new ButtonGenerator(buttons, renderPath+"\\Buttons",this);
		}
	}
	private void miscCDsZip()
	{
		if(seniorGUI!=null)
		{
			if(zip.size()>0)
			{
				new File(renderPath+"\\Zips").mkdir();
				for(int i=0;i<zip.size();i++)
				{
					if (Thread.currentThread().isInterrupted()) {closed = true; return;}
					updateProgressBar( ((i*100/zip.size())) ,"Zips: "+zip.get(i).first+" "+zip.get(i).last);
					currentOrder = zip.get(i);
					copySeniorImages(renderPath+"\\Zips",i);
				}
			}
			return;
		}
		
		if(cds.size()>0)
		{
			new File(renderPath+"\\CDs").mkdir();
			for(int i=0;i<cds.size();i++)
			{
				if (Thread.currentThread().isInterrupted()) {closed = true; return;}
				updateProgressBar((i/cds.size())*100,"CDs: "+cds.get(i).first+" "+cds.get(i).last);
				currentOrder = cds.get(i);
				copyAllBorderImages(renderPath+"\\CDs",i);	
			}
			new CDEnvelopeGenerator(cds,renderPath+"\\CDs",this);
			new CDGenerator(cds,renderPath+"\\CDs",this);
		}
		if(zip.size()>0)
		{
			if (Thread.currentThread().isInterrupted()) {closed = true; return;}
			new File(renderPath+"\\Zips").mkdir();
			for(int i=0;i<zip.size();i++)
			{
				updateProgressBar((i/zip.size())*100,"Zips: "+zip.get(i).first+" "+zip.get(i).last);
				currentOrder = zip.get(i);
				copyAllBorderImages(renderPath+"\\Zips",i);
			}
		}
	}
	
	public void copySeniorImages(String path, int count)
	{
		try
		{
			new File(path+"\\"+currentOrder.last+"_"+currentOrder.ref).mkdirs();
			FileUtils.copyFile(new File(currentOrder.jobFolder+"\\CroppedLarge\\"+currentOrder.image), 
					new File(path+"\\"+currentOrder.last+"_"+currentOrder.ref+"\\"+count+"_"+currentOrder.last+"_"+currentOrder.first+".jpg"));
			
			String directoryPath = path+"\\"+currentOrder.last+"_"+currentOrder.ref;
			File directory = new File(directoryPath);
			String parentDir = directory.getParent();
	        String zipFileName = parentDir+"\\"+directory.getName() + ".zip";
			
			try
			{
				FileOutputStream fos = new FileOutputStream(zipFileName);
				ZipOutputStream zos = new ZipOutputStream(fos);
				zipFile(directory, directory.getName(), zos);
				zos.close();
				fos.close();
				
			}catch(IOException e) {JOptionPane.showMessageDialog(null, "Error Zipping Image: "+e);e.printStackTrace();}
	        
		}catch(Exception e) {JOptionPane.showMessageDialog(null, "Error with copying SeniorImages");}
		
		
	}
	
	public void copyAllBorderImages(String path, int count)
	{
		ArrayList<String> borders = new ArrayList<String>();
		try
		{

			File cd_borders = new File("TEMPLATES\\CD_Borders.txt");
			String border_line;
			if(cd_borders.exists())
			{
				Scanner cd_borderScanner = new Scanner(cd_borders);
				while(cd_borderScanner.hasNext())
				{
					border_line = cd_borderScanner.nextLine();
					if(!border_line.contains("\\\\")) borders.add(border_line);
					
				}
				cd_borderScanner.close();
			}else JOptionPane.showMessageDialog(null, "CD_Borders.txt File does not exist!");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "ERROR WITH CD_Borders FILE!");}
		
		try
		{
			new File(path+"\\"+currentOrder.last+"_"+currentOrder.ref).mkdirs();
			FileUtils.copyFile(new File(currentOrder.jobFolder+"\\CroppedLarge\\"+currentOrder.ref+".jpg"), 
					new File(path+"\\"+currentOrder.last+"_"+currentOrder.ref+"\\"+count+"_"+currentOrder.last+"_"+currentOrder.first+".jpg"));
			for(String b:borders)
			{
				FileUtils.copyFile(new File(currentOrder.jobFolder+"\\Borders\\"+b+"\\"+currentOrder.ref+".jpg"), 
						new File(path+"\\"+currentOrder.last+"_"+currentOrder.ref+"\\"+count+"_"+currentOrder.last+"_"+currentOrder.first+"_"+b+".jpg"));
			}
			
		}catch (IOException e){JOptionPane.showMessageDialog(null, "Error Copying Border Image image: "+e);}
		
		

			String directoryPath = path+"\\"+currentOrder.last+"_"+currentOrder.ref;
			File directory = new File(directoryPath);
			String parentDir = directory.getParent();
	        String zipFileName = parentDir+"\\"+directory.getName() + ".zip";
		try
		{
			FileOutputStream fos = new FileOutputStream(zipFileName);
			ZipOutputStream zos = new ZipOutputStream(fos);
			zipFile(directory, directory.getName(), zos);
			zos.close();
			fos.close();
			
		}catch(IOException e) {JOptionPane.showMessageDialog(null, "Error Zipping Image: "+e);e.printStackTrace();}

	}
	
    private static void zipFile(File fileToZip, String fileName, ZipOutputStream zos) throws IOException {
        if (fileToZip.isHidden()) {
            return;
        }
        if (fileToZip.isDirectory()) {
            if (fileName.endsWith("/")) {
                zos.putNextEntry(new ZipEntry(fileName));
                zos.closeEntry();
            } else {
                zos.putNextEntry(new ZipEntry(fileName + "/"));
                zos.closeEntry();
            }
            File[] children = fileToZip.listFiles();
            for (File childFile : children) {
                zipFile(childFile, fileName + "/" + childFile.getName(), zos);
            }
            return;
        }
        FileInputStream fis = new FileInputStream(fileToZip);
        ZipEntry zipEntry = new ZipEntry(fileName);
        zos.putNextEntry(zipEntry);
        byte[] bytes = new byte[1024];
        int length;
        while ((length = fis.read(bytes)) >= 0) {
            zos.write(bytes, 0, length);
        }
        fis.close();
    }
	
	private boolean miscEnvelopesLabels()
	{
		//if(seniorGUI!=null) filterSeniorEnvelopes();
		RenderEnvelopes renderEnvelopes = new RenderEnvelopes(envelopes,allPlans,renderPath+"\\Envelopes",this,sortBy,composites);
		if(!renderEnvelopes.renderEnvelopes()) return false;
		try {Thread.sleep(1000);} catch (InterruptedException e) {System.out.println("HI1");}
		RenderLargeEnvelopes renderLargeEnv = new RenderLargeEnvelopes(largeEnvelopes,allPlans,renderPath+"\\LargeEnvelopes",this,sortBy);
		if(!renderLargeEnv.renderLargeEnvelopes()) return false;
		try {Thread.sleep(1000);} catch (InterruptedException e) {System.out.println("HI2");}
		new RenderLabels(labels,allPlans,renderPath+"\\Labels",this,sortBy);
		return true;
	}
	
	
	private void miscGroup()
	{
		if(group5x7s.size()>0)
		{
			new File(renderPath+"\\Group5x7s").mkdir();
			int t = 0;
			for(RenderOrder g:group5x7s)
			{
				if (Thread.currentThread().isInterrupted()) {closed = true; return;}
				updateProgressBar((t/group5x7s.size())*100,"Groups5x7: "+g.first+" "+g.last);
				if(!g.homeroom.equals(""))
				{
					currentOrder = g;
					try
					{
						FileUtils.copyFile(new File(currentOrder.jobFolder+"\\Group5X7\\"+currentOrder.homeroom+".jpg"), 
								new File(renderPath+"\\Group5x7s\\"+currentOrder.homeroom+"_"+currentOrder.last+"_"+currentOrder.first+"_"+t+".jpg"));
					}catch (IOException e){JOptionPane.showMessageDialog(null, "Error Copying Group5x7 image: "+e);}
				}
				t++;
			}
			updateProgressBar((t*100)/group5x7s.size(),"Groups5x7s: Done!");
		}
		if(group8x10s.size()>0)
		{
			int t = 0;
			for(RenderOrder g:group8x10s)
			{
				updateProgressBar((t/group8x10s.size())*100,"Groups: "+g.first+" "+g.last);
				if(!g.homeroom.equals(""))
				{
					currentOrder = g;
					createGroupBackground();
					renderPage("8x10 Group");
				}
				t++;
			}
			updateProgressBar((t*100)/group8x10s.size(),"Groups: Done!");
		}
	}
	
	////Try to figure out how to render IDs when everything else renderes instead of making list
	////Need a way to pull create an ArrayList<Student> from ArrayList<RenderOrder>
	private void miscIDCard()
	{
		if(fallGUI!=null&&ids.size()>0)
		{
			new File(renderPath+"\\IDs").mkdir();
			//ArrayList<Student> stuIDs = new ArrayList<Student>();
			for(RenderOrder s:ids)
			{
				fallGUI.getStudents().addStudentToList("ExtraID", s.ref, true);
			//	stuIDs.add(arg0)
			}
			/*
			IDCardCreator idCreator = new IDCardCreator(renderPath+"\\IDs");
			idCreator.getTemplates();
			idCreator.regular(fallGUI.job.stuID, fallGUI.job.facID, ids, fallGUI.schoolPath, true);
			*/
		}
	}
	
	private void miscDigital()
	{
		if(digital.size()>0)
		{
			new File(renderPath+"\\DigitalDownload\\ENC").mkdirs();
			new QRCodeGenerator(digital, renderPath+"\\DigitalDownload",this,job.job);
		}
	}
	
	private void miscSmileCollection()
	{
		if(smileCollection.size()>0)
		{
	    	for(int i=0;i<smileCollection.size();i++)
	    	{
	    		if (Thread.currentThread().isInterrupted()) {closed = true; return;}
				currentOrder = smileCollection.get(i);
				updateProgressBar((i*100)/smileCollection.size(), "SmileCollection: "+currentOrder.last+", "+currentOrder.first);
	    		try{
		    		bImage = new BufferedImage(2400,3150, BufferedImage.TYPE_INT_RGB);
		    		g = bImage.createGraphics();
		    		stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Borders\\border_SmileBeautiful\\"+currentOrder.image));
		    	}
		    	catch(IOException e) {logger("Error Opeining Beautiful: "+currentOrder.ref+": "+currentOrder.first+" "+currentOrder.last+": Trying again...");}
				
				threeXFivefiveXSeven();
				g.setColor(Color.black);
				textWriter("Beautiful 2-3x5 & 5x7: 1 of 1");
				writeFinal("SmileCollection_1-4");
				
		    	try{
		    		bImage = new BufferedImage(2400,3150, BufferedImage.TYPE_INT_RGB);
		    		g = bImage.createGraphics();
		    		stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Borders\\border_SmileGood\\"+currentOrder.image));
		    	}
		    	catch(IOException e) {logger("Error Opeining Good: "+currentOrder.ref+": "+currentOrder.first+" "+currentOrder.last+": Trying again...");}
				
				threeXFivefiveXSeven();
				g.setColor(Color.black);
				textWriter("Good 2-3x5 & 5x7: 1 of 1");
				writeFinal("SmileCollection_2-4");
				
		    	try{
		    		bImage = new BufferedImage(2400,3150, BufferedImage.TYPE_INT_RGB);
		    		g = bImage.createGraphics();
		    		stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Borders\\border_SmileGroovy\\"+currentOrder.image));
		    	}
		    	catch(IOException e) {logger("Error Opeining Groovy: "+currentOrder.ref+": "+currentOrder.first+" "+currentOrder.last+": Trying again...");}
				
				threeXFivefiveXSeven();
				g.setColor(Color.black);
				textWriter("Groovy 2-3x5 & 5x7: 1 of 1");
				writeFinal("SmileCollection_3-4");
				
		    	try{
		    		bImage = new BufferedImage(2400,3150, BufferedImage.TYPE_INT_RGB);
		    		g = bImage.createGraphics();
		    		stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Borders\\border_SmileJourney\\"+currentOrder.image));
		    	}
		    	catch(IOException e) {logger("Error Opeining Journey: "+currentOrder.ref+": "+currentOrder.first+" "+currentOrder.last+": Trying again...");}
				
				threeXFivefiveXSeven();
				g.setColor(Color.black);
				textWriter("Journey 2-3x5 & 5x7: 1 of 1");
				writeFinal("SmileCollection_4-4");
	    	}
		}
	}
	
	private void miscSmileMagnets()
	{
		if(smileMagnets.size()>0)
		{
			new File(renderPath+"\\SmileMagnets").mkdir();
			for(int i=0;i<smileMagnets.size();i++)
			{
				if (Thread.currentThread().isInterrupted()) {closed = true; return;}
				currentOrder = smileMagnets.get(i);
				updateProgressBar((i*100)/smileMagnets.size(), "SmileMagnets: "+currentOrder.last+", "+currentOrder.first);
				
	    		try{
		    		bImage = new BufferedImage(1650,2250, BufferedImage.TYPE_INT_RGB);
		    		g = bImage.createGraphics();
		    		stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Borders\\border_SmileGroovy\\"+currentOrder.image));
		    		tempImage = stuImage.getSubimage(100, 0, 2200, stuImage.getHeight());
		    		tempImage = resize(tempImage, 1650, 2250);
		    		g.drawImage(tempImage, 0, 0, null);
					ImageIO.write(bImage, "jpg", new File(renderPath+"\\SmileMagnets\\"+currentOrder.last+"_"+currentOrder.first+"_"+i+"_Groovy.jpg"));
					
		    		stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Borders\\border_SmileGood\\"+currentOrder.image));
		    		tempImage = stuImage.getSubimage(100, 0, 2200, stuImage.getHeight());
		    		tempImage = resize(tempImage, 1650, 2250);
		    		g.drawImage(tempImage, 0, 0, null);
					ImageIO.write(bImage, "jpg", new File(renderPath+"\\SmileMagnets\\"+currentOrder.last+"_"+currentOrder.first+"_"+i+"_Good.jpg"));
					
		    		stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Borders\\border_SmileBeautiful\\"+currentOrder.image));
		    		tempImage = stuImage.getSubimage(100, 0, 2200, stuImage.getHeight());
		    		tempImage = resize(tempImage, 1650, 2250);
		    		g.drawImage(tempImage, 0, 0, null);
					ImageIO.write(bImage, "jpg", new File(renderPath+"\\SmileMagnets\\"+currentOrder.last+"_"+currentOrder.first+"_"+i+"_Beautiful.jpg"));
					
		    		stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Borders\\border_SmileJourney\\"+currentOrder.image));
		    		tempImage = stuImage.getSubimage(100, 0, 2200, stuImage.getHeight());
		    		tempImage = resize(tempImage, 1650, 2250);
		    		g.drawImage(tempImage, 0, 0, null);
					ImageIO.write(bImage, "jpg", new File(renderPath+"\\SmileMagnets\\"+currentOrder.last+"_"+currentOrder.first+"_"+i+"_Journey.jpg"));
					
		    	}
		    	catch(IOException e) {logger("Error Opeining SmileMagnets: "+currentOrder.ref+": "+currentOrder.first+" "+currentOrder.last+" "+currentOrder.image+": "+e);}

			}
		}
	}
	
	
	private void misc10x13()
	{
		if(tenXthirteens.size()>0)
		{
			new File(renderPath+"\\10x13s").mkdir();
			for(int i=0;i<tenXthirteens.size();i++)
			{
				if (Thread.currentThread().isInterrupted()) {closed = true; return;}
				currentOrder = tenXthirteens.get(i);
				createBackground();
				bImage = new BufferedImage(3000,4200,BufferedImage.TYPE_INT_RGB);
				g = bImage.createGraphics();
				g.setColor(Color.white);
				g.fillRect(0, 0, 3000, 4200);
				
				g.setColor(Color.black);
				g.setFont(font);
				fm = g.getFontMetrics();
				int width = fm.stringWidth(currentOrder.first+" "+currentOrder.last);
				g.drawString(currentOrder.first+" "+currentOrder.last, 1500-width/2, 4050);
				g.setFont(font2);
				g.drawString(currentOrder.schoolName+": "+currentOrder.ref , 2000, 4150);

				stuImage = resize(stuImage, 3120,3900);
				tempImage = stuImage.getSubimage(60, 0, 3000, stuImage.getHeight());
				g.drawImage(tempImage, 0, 0, null);
				
				try {
					ImageIO.write(bImage, "JPG", new File(renderPath+"\\10x13s\\"
							+currentOrder.last+"_"+currentOrder.first+"_10x13s_"+i+".jpg"));
				} catch (IOException e) {
					JOptionPane.showMessageDialog(null, "Error with 10x13: "+e.getMessage());
				}
				
				stuImage.flush();
				tempImage.flush();
				bImage.flush();
			}
		}
	}


	public void logger(String line)
	{
		try
		{
			log = new PrintWriter(new BufferedWriter(new FileWriter(renderPath+"\\log.txt",true)));
			log.println(line);
    		log.close();
		}catch(Exception e){}
	}
	

	private void createBackground()
	{
		ArrayList<String> borders = new ArrayList<String>();
		try
		{

			File borderList = new File("TEMPLATES\\BORDERS.txt");
			String borderLine;
			if(borderList.exists())
			{
				Scanner borderScanner = new Scanner(borderList);
				while(borderScanner.hasNext())
				{
					borderLine = borderScanner.nextLine();
					if(!borderLine.contains("\\\\")) borders.add(borderLine);
					
				}
				borderScanner.close();
			}else JOptionPane.showMessageDialog(null, "ORDER_PREP_ITEMS.txt File does not exist!");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "ERROR WITH ORDER_PREP_ITEMS FILE!");}
		
		
    	try{
    		bImage = new BufferedImage(2400,3150, BufferedImage.TYPE_INT_RGB);
    		g = bImage.createGraphics();
    		
    		borderBoolean = false;
    		for(String b:borders)
    		{
    			if(currentOrder.allItems.contains(b))
    			{
    				stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Borders\\"+b+"\\"+currentOrder.image));
    				borderBoolean = true;
    				break;
    			}
    		}
    		if(borderBoolean){}
    		else if(new File(currentOrder.jobFolder+"\\CroppedLargeWithBorder\\").exists()) stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\CroppedLargeWithBorder\\"+currentOrder.image));
    		else stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\CroppedLarge\\"+currentOrder.image));
			if(stuImage.getWidth()>stuImage.getHeight()) stuImage = rotate(stuImage,true);
			
			//logger("Success Opening: "+currentOrder.ref+": "+currentOrder.last+" "+currentOrder.first+", Order: "+currentOrder.order);
    	}
    	catch(IOException e)
    	{
    		logger("Error Opeining: "+currentOrder.ref+": "+currentOrder.first+" "+currentOrder.last+": Trying again...");
	    	try
	    	{
	    		Thread.sleep(500);    		
	    		bImage = new BufferedImage(2400,3150, BufferedImage.TYPE_INT_RGB);
	    		g = bImage.createGraphics();
	    		
	    		logger("Succes 2nd Opening: "+currentOrder.ref+": "+currentOrder.last+" "+currentOrder.first+", Order: "+currentOrder.order);
	    		
	    		borderBoolean = false;
	    		for(String b:borders)
	    		{
	    			if(currentOrder.allItems.contains(b))
	    			{
	    				stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Borders\\"+b+"\\"+currentOrder.image));
	    				borderBoolean = true;
	    				break;
	    			}
	    		}
	    		if(borderBoolean){}
	    		else if(new File(currentOrder.jobFolder+"\\CroppedLargeWithBorder\\").exists()) stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\CroppedLargeWithBorder\\"+currentOrder.image));
	    		else stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\CroppedLarge\\"+currentOrder.image));
				if(stuImage.getWidth()>stuImage.getHeight()) stuImage = rotate(stuImage,true);
	    	}
	    	catch(Exception err)
	    	{
	    		JOptionPane.showMessageDialog(null, "Second Attempt Opening: "+currentOrder.ref+" FAILED!\n Make sure image has been prepped.");
	    		logger("Error Opening StuImage 2nd time: "+currentOrder.ref+": "+currentOrder.first+" "+currentOrder.last);
	    	}
	    }
	}
	private void createGroupBackground()
	{
		
    	try{
    		bImage = new BufferedImage(2400,3150, BufferedImage.TYPE_INT_RGB);
    		g = bImage.createGraphics();
    		
			stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Group8x10\\"+currentOrder.homeroom+".jpg"));
			stuImage = rotate(stuImage);
			
    	}
    	catch(IOException e)
    	{
    		logger("Error Opeining: "+currentOrder.ref+": "+currentOrder.first+" "+currentOrder.last+": Trying again...");
	    	try
	    	{
	    		Thread.sleep(500);    		
	    		bImage = new BufferedImage(2400,3150, BufferedImage.TYPE_INT_RGB);
	    		g = bImage.createGraphics();
	    		
	    		logger("Succes 2nd Opening: "+currentOrder.ref+": "+currentOrder.last+" "+currentOrder.first+", Order: "+currentOrder.order);
	    		
	    		stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\Group8x10\\"+currentOrder.homeroom+".jpg"));
	    		stuImage = rotate(stuImage);
	    	}
	    	catch(Exception err)
	    	{
	    		JOptionPane.showMessageDialog(null, "Second Attempt Opening: "+currentOrder.ref+" FAILED!\n Make sure image has been prepped.");
	    		logger("Error Opening StuImage 2nd time: "+currentOrder.ref+": "+currentOrder.first+" "+currentOrder.last);
	    	}
	    }
	}
	
	public void textWriter(String text)
	{
		String sort = "";
		switch (sortBy)
		{
			case 1: sort = currentOrder.grade+":   ";
			break;
			case 2: sort = currentOrder.homeroom+":   ";
			break;
		}
		g.setFont(new Font("Arial",Font.PLAIN,35));
		g.drawString(currentOrder.schoolName,50,3035);
		
		g.setFont(barcode);
		g.drawString("*"+currentOrder.ref+"*", 50, 3130);
		
		g.setFont(font);
		fm = g.getFontMetrics(font);
		rect = fm.getStringBounds(sort+currentOrder.last+", "+currentOrder.first, g);
		int centerPosition = 1200-((int)(rect.getWidth()/2));
		g.drawString(sort+currentOrder.last+", "+currentOrder.first, centerPosition, 3110);
		
		
		g.setFont(font2);
		g.drawString(text, 2000, 3050);
	}
	public void writeFinal(String text)
	{
		try
		{
			unitCount++;
			String sort = "";
			switch (sortBy)
			{
				case 1: sort = currentOrder.grade+"_";
				break;
				case 2: sort = currentOrder.homeroom+"_";
				break;
			}
			new File(renderOutput.getAbsolutePath()+"\\Units").mkdir();
			ImageIO.write(bImage, "jpg", new File(renderOutput.getAbsolutePath()+"\\Units\\"+sort
					+currentOrder.last+"_"+currentOrder.first+"_"+unitCount+"_"+text+".jpg"));
			
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Writing Final: "+e);}
	}
	
	private void renderPage(String plan)
	{
		try{
			if(plan.equals("8x10"))
			{
				eightXTen();
				g.setColor(Color.black);
				textWriter("8x10: 1 0f 1");
				writeFinal(plan+"_1 of 1");
			}
			else if(plan.equals("8x10 Group"))
			{
				eightXTen();
				g.setColor(Color.black);
				textWriter("8x10 Group: 1 0f 1");
				writeFinal(plan+"_1 of 1");
			}
			else if(plan.equals("2-8x10"))
			{
				eightXTen();
				g.setColor(Color.black);
				textWriter("8x10: 1 of 2");
				writeFinal(plan+"_1-2");
				g.setColor(Color.white);
				textWriter("8x10: 1 of 2");
				g.setColor(Color.black);
				textWriter("8x10: 2 of 2");
				writeFinal(plan+"_2-2");
			}
			else if(plan.equals("3-8x10"))
			{
				eightXTen();
				g.setColor(Color.black);
				textWriter("8x10: 1 of 3");
				writeFinal(plan+"_1-3");
				g.setColor(Color.white);
				textWriter("8x10: 1 of 3");
				g.setColor(Color.black);
				textWriter("8x10: 2 of 3");
				writeFinal(plan+"_2-3");
				g.setColor(Color.white);
				textWriter("8x10: 2 of 3");
				g.setColor(Color.black);
				textWriter("8x10: 3 of 3");
				writeFinal(plan+"_3-3");
			}
			else if(plan.equals("2-5x7"))
			{
				fiveXSeven();
				g.setColor(Color.black);
				textWriter("2:5x7: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("4-5x7"))
			{
				fiveXSeven();
				g.setColor(Color.black);
				textWriter("2-5x7: 1 of 2");
				writeFinal(plan+"_1-2");
				g.setColor(Color.white);
				textWriter("2-5x7: 1 of 2");
				g.setColor(Color.black);
				textWriter("2-5x7: 2 of 2");
				writeFinal(plan+"_2-2");
			}
			else if(plan.equals("6-5x7"))
			{
				fiveXSeven();
				g.setColor(Color.black);
				textWriter("2-5x7: 1 of 3");
				writeFinal(plan+"_1-3");
				g.setColor(Color.white);
				textWriter("2-5x7: 1 of 3");
				g.setColor(Color.black);
				textWriter("2-5x7: 2 of 3");
				writeFinal(plan+"_2-3");
				g.setColor(Color.white);
				textWriter("2-5x7: 2 of 3");
				g.setColor(Color.black);
				textWriter("2-5x7: 3 of 3");
				writeFinal(plan+"_2-3");
			}
			else if(plan.equals("4-4x5"))
			{
				fourXFive();
				g.setColor(Color.black);
				textWriter("4-4x5: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("8-4x5"))
			{
				fourXFive();
				g.setColor(Color.black);
				textWriter("4-4x5: 1 of 2");
				writeFinal(plan+"_1-2");
				g.setColor(Color.white);
				textWriter("4-4x5: 1 of 2");
				g.setColor(Color.black);
				textWriter("4-4x5: 2 of 2");
				writeFinal(plan+"_2-2");
			}
			else if(plan.equals("2-3x5"))
			{
				twoThreeXFive();
				g.setColor(Color.black);
				textWriter("2 3.5x5: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("4-3x5"))
			{
				threeXFive();
				g.setColor(Color.black);
				textWriter("4-3.5x5: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("8-3x5"))
			{
				threeXFive();
				g.setColor(Color.black);
				textWriter("4-3.5x5: 1 of 2");
				writeFinal(plan+"_1-2");
				g.setColor(Color.white);
				textWriter("4-3.5x5: 1 of 2");
				g.setColor(Color.black);
				textWriter("4-3.5x5: 2 of 2");
				writeFinal(plan+"_2-2");
			}
			else if(plan.equals("4 Wallets"))
			{
				wallet4();
				g.setColor(Color.black);
				textWriter("4 Wallets: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("8 Wallets"))
			{
				wallet8();
				g.setColor(Color.black);
				textWriter("8 Wallets: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("16 Wallets"))
			{
				wallet8();
				g.setColor(Color.black);
				textWriter("8 Wallets: 1 of 2");
				writeFinal(plan+"_1-2");
				g.setColor(Color.white);
				textWriter("8 Wallets: 1 of 2");
				g.setColor(Color.black);
				textWriter("8 Wallets: 2 of 2");
				writeFinal(plan+"_2-2");
			}
			else if(plan.equals("24 Wallets"))
			{
				
				wallet8();
				g.setColor(Color.black);
				textWriter("8 Wallets: 1 of 3");
				writeFinal(plan+"_1-3");
				g.setColor(Color.white);
				textWriter("8 Wallets: 1 of 3");
				
				g.setColor(Color.black);
				textWriter("8 Wallets: 2 of 3");
				writeFinal(plan+"_2-3");
				g.setColor(Color.white);
				textWriter("8 Wallets: 2 of 3");
				
				g.setColor(Color.black);
				textWriter("8 Wallets: 3 of 3");
				writeFinal(plan+"_3-3");
			}
			else if(plan.equals("32 Wallets"))
			{
				wallet8();
				g.setColor(Color.black);
				textWriter("8 Wallets: 1 of 4");
				writeFinal(plan+"_1-4");
				g.setColor(Color.white);
				textWriter("8 Wallets: 1 of 4");
				
				g.setColor(Color.black);
				textWriter("8 Wallets: 2 of 4");
				writeFinal(plan+"_2-4");
				g.setColor(Color.white);
				textWriter("8 Wallets: 2 of 4");
				
				g.setColor(Color.black);
				textWriter("8 Wallets: 3 of 4");
				writeFinal(plan+"_3-4");
				g.setColor(Color.white);
				textWriter("8 Wallets: 3 of 4");
				
				g.setColor(Color.black);
				textWriter("8 Wallets: 4 of 4");
				writeFinal(plan+"_4-4");
			}
			else if(plan.equals("16 Mini"))
			{
				mini16();
				g.setColor(Color.black);
				textWriter("16 Mini: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			
			else if(plan.equals("2-3x5 & 5x7"))
			{
				threeXFivefiveXSeven();
				g.setColor(Color.black);
				textWriter("2-3x5 & 5x7: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			
			else if(plan.equals("4 Wall & 5x7"))
			{
				wallet4fiveXSeven();
				g.setColor(Color.black);
				textWriter("4 Wall & 5x7: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("4 Wall & 2-4x5"))
			{
				wallet4fourXFive();
				g.setColor(Color.black);
				textWriter("4 Wall & 2:4x5: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("4 Wall & 2-3x5"))
			{
				wallet4threeXFive();
				g.setColor(Color.black);
				textWriter("4 Wall & 2 3.5x5: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("8 Mini & 2-4x5"))
			{
				mini8fourXFive();
				g.setColor(Color.black);
				textWriter("8 Mini & 2:4x5: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("8 Mini & 2-3x5"))
			{
				mini8threeXFive();
				g.setColor(Color.black);
				textWriter("8 Mini & 2 3.5x5: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("6-3x5 & 12 Wallets"))
			{
				//4 of the 3x5's
				threeXFive();
				g.setColor(Color.black);
				textWriter("4-3.5x5: 1 of 1");
				writeFinal(plan+"_1-1");
				//last of the 3x5's and 4 wallets
				wallet4threeXFive();
				g.setColor(Color.black);
				textWriter("4 Wall & 2 3.5x5: 1 of 1");
				writeFinal(plan+"_1-1");
				//last 8 wallets
				wallet8();
				g.setColor(Color.black);
				textWriter("8 Wallets: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("3-5x7 & 12 Wallets"))
			{
				//2 of the 5x7's
				fiveXSeven();
				g.setColor(Color.black);
				textWriter("2:5x7: 1 of 1");
				writeFinal(plan+"_1-1");
				//3rd 5x7 and 4 wallets
				wallet4fiveXSeven();
				g.setColor(Color.black);
				textWriter("4 Wall & 5x7: 1 of 1");
				writeFinal(plan+"_1-1");
				//last 8 wallets
				wallet8();
				g.setColor(Color.black);
				textWriter("8 Wallets: 1 of 1");
				writeFinal(plan+"_1-1");
			}
			else if(plan.equals("Second Look"))
			{
				stuImage.flush();
				stuImage = ImageIO.read(new File(currentOrder.jobFolder+"\\SecondLook\\"+currentOrder.image));
				g.setColor(Color.white);
				g.fillRect(0, 0, 2400, 3150);
	    		tempImage = rotate(stuImage);
	    		g.drawImage(tempImage, 0, 0, null);

	    		tempImage = resize(tempImage, 1050,750);
	    		g.drawImage(tempImage, 0, 1502, null);
	    		g.drawImage(tempImage, 1052, 1502, null);
	    		g.drawImage(tempImage, 0, 2254, null);
	    		g.drawImage(tempImage, 1052, 2254, null);
	    		tempImage.flush();
	    		stuImage.flush();
	    		g.setColor(Color.black);
	    		textWriter("SecondLook");
	    		writeFinal("SecondLook");
			}
			try{bImage.flush();bImage = null;}catch(NullPointerException e){}
			try{stuImage.flush();bImage = null;}catch(NullPointerException e){}
			try{tempImage.flush();bImage = null;}catch(NullPointerException e){}
			
		}catch(Exception e){logger("\nRender Page Error: "+plan+" "+currentOrder.last+" "+e+"\n");}
	}
	private void eightXTen()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		g.drawImage(stuImage, 0, 0, null);
	}
	private void fiveXSeven()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		
		tempImage = stuImage.getSubimage(128, 0, 2143, stuImage.getHeight());
		tempImage = resize(tempImage,1500,2100);
		tempImage=rotate(tempImage);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 0, 1501, null);
	}
	private void fourXFive()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		
		tempImage = resize(stuImage,1200,1500);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 1202,0, null);
		g.drawImage(tempImage, 0,1502, null);
		g.drawImage(tempImage, 1202,1502,null);
	}
	private void twoThreeXFive()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		//threeXFive
		tempImage = stuImage.getSubimage(150, 0, 2100, stuImage.getHeight());
		tempImage = resize(tempImage,1050,1500);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 1052,0, null);			
	}
	private void threeXFive()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		tempImage = stuImage.getSubimage(150, 0, 2100, stuImage.getHeight());
		tempImage = resize(tempImage,1050,1500);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 1052,0, null);
		g.drawImage(tempImage, 0,1502, null);
		g.drawImage(tempImage, 1052,1502,null);		
	}
	
	private void wallet4()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		
		//if(bNameW) startWallet();
		
		tempImage = stuImage.getSubimage(128, 0, 2143, stuImage.getHeight());
		tempImage = resize(tempImage,750,1050);
		tempImage = rotate(tempImage);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 1052, 0, null);
		g.drawImage(tempImage, 0, 752, null);
		g.drawImage(tempImage, 1052, 752, null);
		
		//if(bNameW) endWallet();

	}
	private void wallet8()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		
		//if(bNameW) startWallet();
		
		tempImage = stuImage.getSubimage(128, 0, 2143, stuImage.getHeight());
		tempImage = resize(tempImage,750,1050);
		tempImage = rotate(tempImage);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 1052, 0, null);
		g.drawImage(tempImage, 0, 752, null);
		g.drawImage(tempImage, 1052, 752, null);
		g.drawImage(tempImage, 0, 1504, null);
		g.drawImage(tempImage, 1054, 1504, null);
		g.drawImage(tempImage, 0, 2254, null);
		g.drawImage(tempImage, 1054, 2254, null);
		
		//if(bNameW) endWallet();
	}
	
	private void threeXFivefiveXSeven()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		//threeXFive
		tempImage = stuImage.getSubimage(150, 0, 2100, stuImage.getHeight());
		tempImage = resize(tempImage,1050,1500);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 1052,0, null);			
		
		//5x7
		tempImage = stuImage.getSubimage(128, 0, 2143, stuImage.getHeight());
		tempImage = resize(tempImage,1500,2100);
		tempImage=rotate(tempImage);
		g.drawImage(tempImage, 0, 1502, null);
	}
	
	private void wallet4fiveXSeven()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		
		//if(bNameW) startWallet();
		
		tempImage = stuImage.getSubimage(128, 0, 2143, stuImage.getHeight());
		tempImage = resize(tempImage,750,1050);
		tempImage = rotate(tempImage);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 1052, 0, null);
		g.drawImage(tempImage, 0, 752, null);
		g.drawImage(tempImage, 1052, 752, null);
		
		//if(bNameW) endWallet();
		
		tempImage = stuImage.getSubimage(128, 0, 2143, stuImage.getHeight());
		tempImage = resize(tempImage,1500,2100);
		tempImage=rotate(tempImage);
		g.drawImage(tempImage, 0, 1504, null);
		
	}
	private void wallet4fourXFive()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		
		//if(bNameW) startWallet();
		
		tempImage = stuImage.getSubimage(128, 0, 2143, stuImage.getHeight());
		tempImage = resize(tempImage,750,1050);
		tempImage = rotate(tempImage);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 1052, 0, null);
		g.drawImage(tempImage, 0, 752, null);
		g.drawImage(tempImage, 1052, 752, null);
		
		//if(bNameW) endWallet();
		
		tempImage = resize(stuImage,1200,1500);
		g.drawImage(tempImage, 0,1504, null);
		g.drawImage(tempImage, 1202,1504,null);
	}
	private void wallet4threeXFive()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		
		//if(bNameW) startWallet();
		
		tempImage = stuImage.getSubimage(128, 0, 2143, stuImage.getHeight());
		tempImage = resize(tempImage,750,1050);
		tempImage = rotate(tempImage);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 1052, 0, null);
		g.drawImage(tempImage, 0, 752, null);
		g.drawImage(tempImage, 1052, 752, null);
		
		//if(bNameW) endWallet();
				
		tempImage = stuImage.getSubimage(150, 0, 2100, stuImage.getHeight());
		tempImage = resize(tempImage,1050,1500);
		g.drawImage(tempImage, 0,1504, null);
		g.drawImage(tempImage, 1052,1504,null);	
	}
	private void mini8fourXFive()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		
		tempImage = resize(stuImage,1200,1500);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 1202, 0, null);
		
		tempImage = resize(stuImage,600,750);
		g.drawImage(tempImage, 0, 1502, null);
		g.drawImage(tempImage, 602, 1502, null);
		g.drawImage(tempImage, 1204, 1502, null);
		g.drawImage(tempImage, 1806, 1502,null);
		g.drawImage(tempImage, 0, 2254, null);
		g.drawImage(tempImage, 602, 2254, null);
		g.drawImage(tempImage, 1204, 2254, null);
		g.drawImage(tempImage, 1806, 2254,null);
	}
	private void mini8threeXFive()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		
		tempImage = stuImage.getSubimage(150, 0, 2100, stuImage.getHeight());
		tempImage = resize(tempImage,1050,1500);
		g.drawImage(tempImage, 0,0, null);
		g.drawImage(tempImage, 1052,0,null);		
		
		tempImage = resize(stuImage,600,750);
		g.drawImage(tempImage, 0, 1502, null);
		g.drawImage(tempImage, 602, 1502, null);
		g.drawImage(tempImage, 1204, 1502, null);
		g.drawImage(tempImage, 1806, 1502,null);
		g.drawImage(tempImage, 0, 2254, null);
		g.drawImage(tempImage, 602, 2254, null);
		g.drawImage(tempImage, 1204, 2254, null);
		g.drawImage(tempImage, 1806, 2254,null);
		
	}
	private void mini16()
	{
		g.setColor(Color.white);
		g.fillRect(0, 0, 2400, 3150);
		
		tempImage = resize(stuImage,600,750);
		g.drawImage(tempImage, 0, 0, null);
		g.drawImage(tempImage, 602, 0, null);
		g.drawImage(tempImage, 1204, 0, null);
		g.drawImage(tempImage, 1806, 0, null);
		g.drawImage(tempImage, 0, 752, null);
		g.drawImage(tempImage, 602, 752, null);
		g.drawImage(tempImage, 1204, 752, null);
		g.drawImage(tempImage, 1806, 752, null);
		g.drawImage(tempImage, 0, 1504, null);
		g.drawImage(tempImage, 602, 1504, null);
		g.drawImage(tempImage, 1204, 1504, null);
		g.drawImage(tempImage, 1806, 1504,null);
		g.drawImage(tempImage, 0, 2256, null);
		g.drawImage(tempImage, 602, 2256, null);
		g.drawImage(tempImage, 1204, 2256, null);
		g.drawImage(tempImage, 1806, 2256,null);
	}
	
	
	//////////////Buffered Image Operations/////////////
    public static GraphicsConfiguration getDefaultConfiguration() {
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gd = ge.getDefaultScreenDevice();
        return gd.getDefaultConfiguration();
    }
    public BufferedImage rotate(BufferedImage image) {
    	int angle = 90;
        double sin = Math.abs(Math.sin(Math.toRadians(angle))), cos = Math.abs(Math.cos(Math.toRadians(angle)));
        int w = image.getWidth(), h = image.getHeight();
        int neww = (int)Math.floor(w*cos+h*sin), newh = (int)Math.floor(h*cos+w*sin);
        GraphicsConfiguration gc = getDefaultConfiguration();
        BufferedImage result = gc.createCompatibleImage(neww, newh, Transparency.TRANSLUCENT);
        gResult = result.createGraphics();
        gResult.translate((neww-w)/2, (newh-h)/2);
        gResult.rotate((Math.toRadians(angle)), w/2, h/2);
        gResult.drawRenderedImage(image, null);
        gResult.dispose();
        return result;
    }
    public BufferedImage rotate(BufferedImage image, boolean b) {
    	int angle = 90;
    	if(b) angle = -90;
        double sin = Math.abs(Math.sin(Math.toRadians(angle))), cos = Math.abs(Math.cos(Math.toRadians(angle)));
        int w = image.getWidth(), h = image.getHeight();
        int neww = (int)Math.floor(w*cos+h*sin), newh = (int)Math.floor(h*cos+w*sin);
        GraphicsConfiguration gc = getDefaultConfiguration();
        BufferedImage result = gc.createCompatibleImage(neww, newh, Transparency.TRANSLUCENT);
        gResult = result.createGraphics();
        gResult.translate((neww-w)/2, (newh-h)/2);
        gResult.rotate((Math.toRadians(angle)), w/2, h/2);
        gResult.drawRenderedImage(image, null);
        gResult.dispose();
        return result;
    }
    public BufferedImage resize(final BufferedImage image, int newWidth, int newHeight) {
    	BufferedImage dimg = new BufferedImage(newWidth, newHeight, image.getType());
        gDimg = dimg.createGraphics();
        gDimg.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        gDimg.drawImage(image,0,0,newWidth,newHeight,null);
        gDimg.dispose();
        return dimg;
    }
}
