package photo.software.league.render;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.GraphicsConfiguration;
import java.awt.GraphicsDevice;
import java.awt.GraphicsEnvironment;
import java.awt.Image;
import java.awt.Transparency;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.comparators.LeagueImageNumberSortComparator;
import photo.software.comparators.LeagueReferenceSortComparator;
import photo.software.comparators.LeagueTeamSortComparator;
import photo.software.league.LeaguePlayer;
import photo.software.login.JobData;

public class RenderLeague implements Runnable
{
	private ArrayList<LeaguePlayer> players;
	private String schoolPath;
	private String outputPath;
	private RenderLeagueGUI render;
	
	private File playerFile, memoryFile;
	private BufferedImage bImage, memoryImg;
	private Graphics2D bG, gResult;
	private int plan;
	private boolean renderEnvelopes;
	
	public RenderLeague(JobData job, ArrayList<LeaguePlayer> players, String schoolPath, 
			String outputPath,int plan, int sort, RenderLeagueGUI render, boolean renderEnvelopes)
	{
		this.players = players;
		this.schoolPath = schoolPath;
		this.outputPath = outputPath+"\\"+job.job;
		this.renderEnvelopes = renderEnvelopes;
		if(sort==1)Collections.sort(players, new LeagueReferenceSortComparator());
		else if(sort==2)Collections.sort(players, new LeagueImageNumberSortComparator());
		else if(sort==3)Collections.sort(players, new LeagueTeamSortComparator());
		this.plan = plan;
		this.render = render;
	}
	public void run()
	{
		try
		{
			new File(outputPath).mkdir();
			
			if(renderEnvelopes)
			{
				ArrayList<LeaguePlayer> renderPlayers = new ArrayList<LeaguePlayer>();
				ArrayList<LeaguePlayer> teamPhotos = new ArrayList<LeaguePlayer>();
				int orders = 0;
				for(LeaguePlayer p:players)
				{
					if(Thread.currentThread().isInterrupted()) return;
					try	{orders = Integer.parseInt(p.order);}catch(NumberFormatException e){orders = 0;}
					if(orders>0)
					{
						if((!p.name1.contains("TEAM"))&&(!p.name2.contains("TEAM")))
							renderPlayers.add(new LeaguePlayer(p));
						else   teamPhotos.add(new LeaguePlayer(p));
					}
				}
				new File(outputPath+"\\Envelopes").mkdir();
				new RenderLeagueEnvelopes(renderPlayers,teamPhotos,schoolPath,outputPath+"\\Envelopes");
			}
			
			if(plan==0) memory8Wallets();		//Standard League Plan 8 Wallets & Memory Mate
			else if(plan==1) eightXten();
			else if(plan==2) memory4Wallets5x7();

			
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Card Creator: "+e);}
		
	}
	//Creates an 8x10 for each player
	private void eightXten()
	{
		int eightXtenCount = 1;
		ArrayList<LeaguePlayer> renderPlayers = new ArrayList<LeaguePlayer>();
		int orders = 0;
		LeaguePlayer temp;
		//Builds list of players
		for(LeaguePlayer p: players)
		{
			try	{orders = Integer.parseInt(p.order);}catch(NumberFormatException e){orders = 0;}
			for(int i = 0;i<orders;i++)
			{
				temp = new LeaguePlayer(p);
				temp.order = (i+1)+" of "+orders;
				if((!temp.name1.contains("TEAM"))&&(!temp.name2.contains("TEAM")))
					renderPlayers.add(new LeaguePlayer(temp));
			}
		}
		try
		{
			//Creates an 8x10 for each player
			for(LeaguePlayer p:renderPlayers)
			{
				render.printText("8x10: "+p.team+" "+p.name1+" "+p.name2+"\n");
				bImage = new BufferedImage(2400, 3150, BufferedImage.TYPE_INT_RGB);
				create8x10(p);
				ImageIO.write(bImage, "jpg", new File(outputPath+"\\"+String.format("%05d", eightXtenCount)+"_"+p.team+"_"+p.name1+"_"+p.name2+"_8x10.jpg"));	
				bImage.flush();
				render.updateProgressBar((eightXtenCount*100)/renderPlayers.size());
				eightXtenCount++;
			}
		}catch(Exception e){render.printText("Error writing Image: "+e+"\n On 8x10: "+eightXtenCount+"\n");}
	}
	//Creates 8 wallets and a memory mate for each player
	private void memory8Wallets()
	{
		int walletCount = 1, memoryCount = 1;
		ArrayList<LeaguePlayer> renderPlayers = new ArrayList<LeaguePlayer>();
		ArrayList<LeaguePlayer> teamPhotos = new ArrayList<LeaguePlayer>();
		int orders = 0;
		LeaguePlayer temp;
		//Builds list of players images and team images
		for(LeaguePlayer p: players)
		{
			try	{orders = Integer.parseInt(p.order);}catch(NumberFormatException e){orders = 0;}
			for(int i = 0;i<orders;i++)
			{
				temp = new LeaguePlayer(p);
				temp.order = (i+1)+" of "+orders;
				if((!temp.name1.contains("TEAM"))&&(!temp.name2.contains("TEAM")))
					renderPlayers.add(new LeaguePlayer(temp));
				else   teamPhotos.add(new LeaguePlayer(temp));
			}
		}
		try
		{
			//Builds 8 wallets for each player
			for(LeaguePlayer p:renderPlayers)
			{
				render.printText("Walltes: "+p.team+" "+p.name1+" "+p.name2+"\n");
				bImage = new BufferedImage(2550, 3300, BufferedImage.TYPE_INT_RGB);
				createWallets(p);
				ImageIO.write(bImage, "jpg", new File(outputPath+"\\"+String.format("%05d", walletCount)+"_"+p.team+"_"+p.name1+"_"+p.name2+"_Wallets.jpg"));	
				bImage.flush();
				render.updateProgressBar((walletCount*100)/renderPlayers.size());
				walletCount++;
			}
			String currentTeam = "";
			memoryImg = null;
			//Builds memory mate for each player
			for(LeaguePlayer p:renderPlayers)
			{
				if(!currentTeam.equals(p.team))
				{
					if(memoryImg!=null) memoryImg.flush();
					currentTeam = p.team;
					memoryFile = new File(schoolPath+"\\Templates\\"+currentTeam+".png");
					if(memoryFile.exists()) memoryImg  = ImageIO.read(memoryFile);
				}
				render.printText("Memory: "+p.team+" "+p.name1+" "+p.name2+"\n");
				bImage = new BufferedImage(2550, 3300, BufferedImage.TYPE_INT_RGB);
				createMemory(p);
				ImageIO.write(bImage, "jpg", new File(outputPath+"\\"+String.format("%05d", memoryCount)+"_"+p.team+"_"+p.name1+"_"+p.name2+"_Memory.jpg"));	
				bImage.flush();
				render.updateProgressBar((memoryCount*100)/renderPlayers.size());
				memoryCount++;
			}
			memoryImg.flush();
			
		}catch(Exception e){render.printText("Error writing Image: "+e+"\n On Wallet: "+walletCount+" Memory: "+memoryCount+"\n");}

	}
	private void memory4Wallets5x7()
	{
		int unitCount = 1, memoryCount = 1;
		ArrayList<LeaguePlayer> renderPlayers = new ArrayList<LeaguePlayer>();
		ArrayList<LeaguePlayer> teamPhotos = new ArrayList<LeaguePlayer>();
		int orders = 0;
		LeaguePlayer temp;
		for(LeaguePlayer p: players)
		{
			try	{orders = Integer.parseInt(p.order);}catch(NumberFormatException e){orders = 0;}
			for(int i = 0;i<orders;i++)
			{
				temp = new LeaguePlayer(p);
				temp.order = (i+1)+" of "+orders;
				if((!temp.name1.contains("TEAM"))&&(!temp.name2.contains("TEAM")))
					renderPlayers.add(new LeaguePlayer(temp));
				else   teamPhotos.add(new LeaguePlayer(temp));
			}
		}
		try
		{
			
			for(LeaguePlayer p:renderPlayers)
			{
				render.printText("Wallets&5x7: "+p.team+" "+p.name1+" "+p.name2+"\n");
				bImage = new BufferedImage(2550, 3300, BufferedImage.TYPE_INT_RGB);
				createWallet5x7(p);
				ImageIO.write(bImage, "jpg", new File(outputPath+"\\"+String.format("%05d", unitCount)+"_"+p.team+"_"+p.name1+"_"+p.name2+"_4Wall&5x7.jpg"));	
				bImage.flush();
				render.updateProgressBar((unitCount*100)/renderPlayers.size());
				unitCount++;
			}
			String currentTeam = "";
			memoryImg = null;
			for(LeaguePlayer p:renderPlayers)
			{
				if(!currentTeam.equals(p.team))
				{
					if(memoryImg!=null) memoryImg.flush();
					currentTeam = p.team;
					memoryFile = new File(schoolPath+"\\Templates\\"+currentTeam+".png");
					if(memoryFile.exists()) memoryImg  = ImageIO.read(memoryFile);
				}
				bImage = new BufferedImage(2550, 3300, BufferedImage.TYPE_INT_RGB);
				createMemory(p);
				ImageIO.write(bImage, "jpg", new File(outputPath+"\\"+String.format("%05d", memoryCount)+"_"+p.team+"_"+p.name1+"_"+p.name2+"_Memory.jpg"));	
				bImage.flush();
				render.updateProgressBar((memoryCount*100)/renderPlayers.size());
				memoryCount++;
			}
			memoryImg.flush();
			
		}catch(Exception e){render.printText("Error writing Image: "+e+"\n On Wallet: "+unitCount+" Memory: "+memoryCount+"\n");}

	}
	
	private void createMemory(LeaguePlayer p)
	{
		try
		{
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 2550, 3300);
			playerFile = new File(schoolPath+"\\Images\\"+p.image);
			if(playerFile.exists()&&memoryFile.exists())
			{
				BufferedImage playerImg = ImageIO.read(playerFile);
				bG.drawImage(playerImg.getScaledInstance(-1, 1360, Image.SCALE_SMOOTH), 1315, 190, null);
				playerImg.flush();
				bG.drawImage(memoryImg, 0, 0, null);
			}
		}catch(Exception e){render.printText("Error createMemory: "+p.ref+" "+e+"\n");}
	}
	private void create8x10(LeaguePlayer p)
	{
		try
		{
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 2550, 3300);
			playerFile = new File(schoolPath+"\\Images\\"+p.image);
			if(playerFile.exists())
			{
				BufferedImage playerImg = ImageIO.read(playerFile);
				bG.drawImage(playerImg, 0, 0, null);
				playerImg.flush();
				
				bG.setColor(Color.black);
				bG.setFont(new Font("Arial",Font.PLAIN,50));
				
				bG.drawString(p.ref+":  "+p.image+"   8x10: "+p.order, 150, 3065);
				bG.drawString(p.team+": "+p.name1+", "+p.name2, 150, 3130);
				bG.drawString("Island Photography \u00a92025:  559-456-1400", 1200,3065);
			}
		}catch(Exception e){render.printText("Error create8x10: "+p.ref+" "+e+"\n");}
	}
	private void createWallets(LeaguePlayer p)
	{
		try
		{
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 2550, 3300);
			playerFile = new File(schoolPath+"\\Images\\"+p.image);
			if(playerFile.exists())
			{
				BufferedImage playerImg = ImageIO.read(playerFile);
				BufferedImage tempImage = playerImg.getSubimage(128, 0, 2143, playerImg.getHeight());
				tempImage = rotate(tempImage);
				Image temp = tempImage.getScaledInstance(1050, -1, Image.SCALE_SMOOTH);
				
				bG.drawImage(temp, 150, 135, null);
				bG.drawImage(temp, 150, 896, null);
				bG.drawImage(temp, 150, 1657, null);
				bG.drawImage(temp, 150, 2418, null);
				
				bG.drawImage(temp, 1211, 135, null);
				bG.drawImage(temp, 1211, 896, null);
				bG.drawImage(temp, 1211, 1657, null);
				bG.drawImage(temp, 1211, 2418, null);
				
				playerImg.flush();
				tempImage.flush();
				temp.flush();
				
				bG.setColor(Color.black);
				bG.setFont(new Font("Arial",Font.PLAIN,50));
				
				bG.rotate(-Math.PI/2);				
				
				bG.drawString(p.ref+":  "+p.image+"   Count: "+p.order, -3165, 2340);
				bG.drawString(p.team+": "+p.name1+", "+p.name2, -1650, 2340);
				bG.drawString("Island Photography \u00a92025:  559-456-1400", -1650,2400);
				bG.rotate(Math.PI/2);
			}
		}catch(Exception e){render.printText("Error createWallets: "+p.ref+" "+e+"\n");}
	}
	private void createWallet5x7(LeaguePlayer p)
	{
		try
		{
			bG = bImage.createGraphics();
			bG.setColor(Color.white);
			bG.fillRect(0, 0, 2550, 3300);
			playerFile = new File(schoolPath+"\\Images\\"+p.image);
			if(playerFile.exists())
			{
				BufferedImage playerImg = ImageIO.read(playerFile);
				BufferedImage tempImage = playerImg.getSubimage(128, 0, 2143, playerImg.getHeight());
				tempImage = rotate(tempImage);
				
				Image temp = tempImage.getScaledInstance(2100, -1, Image.SCALE_SMOOTH);
				bG.drawImage(temp, 150, 135, null);
				
				temp = tempImage.getScaledInstance(1050, -1, Image.SCALE_SMOOTH);
				bG.drawImage(temp, 150, 1657, null);
				bG.drawImage(temp, 150, 2418, null);
				bG.drawImage(temp, 1211, 1657, null);
				bG.drawImage(temp, 1211, 2418, null);
				
				playerImg.flush();
				tempImage.flush();
				temp.flush();
				
				bG.setColor(Color.black);
				bG.setFont(new Font("Arial",Font.PLAIN,50));
				
				bG.rotate(-Math.PI/2);				
				
				bG.drawString(p.ref+":  "+p.image+"   Count: "+p.order, -3165, 2340);
				bG.drawString(p.team+": "+p.name1+", "+p.name2, -1650, 2340);
				bG.drawString("Island Photography \u00a92025:  559-456-1400", -1650,2400);
				bG.rotate(Math.PI/2);
			}
		}catch(Exception e){render.printText("Error create4Wallet5x7: "+p.ref+" "+e+"\n");}
	}

	
    public static GraphicsConfiguration getDefaultConfiguration() {
        GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
        GraphicsDevice gd = ge.getDefaultScreenDevice();
        return gd.getDefaultConfiguration();
    }
    public BufferedImage rotate(BufferedImage image) {
        double sin = Math.abs(Math.sin(Math.toRadians(-90))), cos = Math.abs(Math.cos(Math.toRadians(-90)));
        int w = image.getWidth(), h = image.getHeight();
        int neww = (int)Math.floor(w*cos+h*sin), newh = (int)Math.floor(h*cos+w*sin);
        GraphicsConfiguration gc = getDefaultConfiguration();
        BufferedImage result = gc.createCompatibleImage(neww, newh, Transparency.TRANSLUCENT);
        gResult = result.createGraphics();
        gResult.translate((neww-w)/2, (newh-h)/2);
        gResult.rotate((Math.toRadians(-90)), w/2, h/2);
        gResult.drawRenderedImage(image, null);
        gResult.dispose();
        return result;
    }

}
