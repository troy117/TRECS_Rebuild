package photo.software.league.render;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;

import javax.imageio.ImageIO;
import javax.swing.JOptionPane;

import photo.software.league.LeaguePlayer;

public class RenderLeagueEnvelopes 
{
	private BufferedImage playerEnvelope, teamEnvelope, stuImage;
	private Image resized;
	private Graphics2D g;
	private String jobPath, outputFolder;
	private ArrayList<LeaguePlayer> players, teams;
	
	public RenderLeagueEnvelopes(ArrayList<LeaguePlayer> players, ArrayList<LeaguePlayer> teams,
			String jobPath, String outputFolder)
	{
		this.jobPath = jobPath;
		this.players = players;
		this.teams = teams;
		this.outputFolder = outputFolder;
		renderPlayerEnvelopes();
		renderTeamEnvelopes();
	}
	private void renderPlayerEnvelopes()
	{
		try
		{
			File envelopeFile = new File(jobPath+"\\Templates\\PlayerEnvelope.jpg");
			File playerFile;
			LeaguePlayer p;
			if(envelopeFile.exists())
			{
				playerEnvelope = ImageIO.read(envelopeFile);
				g = playerEnvelope.createGraphics();
				for(int i=0;i<players.size();i++)
				{
					p = players.get(i);
					g.setColor(Color.white);
					g.fillRect(0, 740, 2625, 820);
					playerFile = new File(jobPath+"\\Images\\"+players.get(i).image);
					if(playerFile.exists())
					{
						stuImage = ImageIO.read(playerFile);
						resized = stuImage.getScaledInstance(-1, 800, Image.SCALE_SMOOTH);
						g.drawImage(resized, 80, 750, null);
						stuImage.flush();
						stuImage = null;
						resized.flush();
						resized = null;
					}
					g.setColor(Color.black);
					g.setFont(new Font("Arial",Font.PLAIN,100));
					g.drawString(players.get(i).name1+", "+players.get(i).name2, 900, 900);
					g.drawString(players.get(i).team, 900, 1050);
					ImageIO.write(playerEnvelope, "JPG", new File(outputFolder+"\\"+String.format("%05d", (i+1))
							+"_"+p.team+"_"+p.name1+"_"+p.name2+"_Envelope.jpg"));
				}
				playerEnvelope.flush();
				playerEnvelope = null;
				
			}
			else JOptionPane.showMessageDialog(null, "PlayerEnvelope.jpg does not exist.");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "RenderPlayerEnvelope Error: "+e);}
	}
	private void renderTeamEnvelopes()
	{
		try
		{
			File envelopeFile = new File(jobPath+"\\Templates\\TeamEnvelope.jpg");
			File playerFile;
			LeaguePlayer t;
			if(envelopeFile.exists())
			{
				teamEnvelope = ImageIO.read(envelopeFile);
				g = teamEnvelope.createGraphics();
				for(int i=0;i<teams.size();i++)
				{
					t = teams.get(i);
					g.setColor(Color.white);
					g.fillRect(0, 800, 3400, 1040);
					playerFile = new File(jobPath+"\\Images\\"+teams.get(i).image);
					if(playerFile.exists())
					{
						stuImage = ImageIO.read(playerFile);
						resized = stuImage.getScaledInstance(-1, 1000, Image.SCALE_SMOOTH);
						g.drawImage(resized, 140, 820, null);
						stuImage.flush();
						stuImage = null;
						resized.flush();
						resized = null;
					}
					g.setColor(Color.black);
					g.setFont(new Font("Arial",Font.PLAIN,150));
					g.drawString(t.team, 1700, 1400);
					ImageIO.write(teamEnvelope, "JPG", new File(outputFolder+"\\Team_"+t.team+"_"+t.name1+"_"+t.name2+"_Envelope.jpg"));
				}
				teamEnvelope.flush();
				teamEnvelope = null;
			}
			else JOptionPane.showMessageDialog(null, "TeamEnvelope.jpg does not exist.");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "RenderTeamEnvelope Error: "+e);}
	}
}
