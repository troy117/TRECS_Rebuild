package photo.software.league;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;

import javax.swing.JOptionPane;

import photo.software.comparators.PlayerReferenceSortComparator;
import photo.software.login.DesktopWindow;
import photo.software.login.JobData;

import com.healthmarketscience.jackcess.CursorBuilder;
import com.healthmarketscience.jackcess.Database;
import com.healthmarketscience.jackcess.DatabaseBuilder;
import com.healthmarketscience.jackcess.IndexCursor;
import com.healthmarketscience.jackcess.Row;
import com.healthmarketscience.jackcess.Table;

public class LeaguePlayers 
{
	private ArrayList<LeaguePlayer> players;
	
	private Database db;
	private Table table;
	public LeaguePlayer current;
	public int currentIndex;
	
	public LeaguePlayers(DesktopWindow window, JobData job)
	{
		players = new ArrayList<LeaguePlayer>();
		File file = new File(window.jobs+"\\"+job.location+"\\"+job.job+"\\Database\\League.accdb");
		try
		{
			db = DatabaseBuilder.open(file);
			table = db.getTable("Players");
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Loading Players database!: "+e);return;}
	}
	
	public boolean openPlayerDatabase()
	{
		try
		{
			String[] temp = new String[6];
			for(Row row:table)
			{
				try{temp[0] = row.get("RefNum").toString();}catch(NullPointerException e){temp[0]="-1";}
				try{temp[1] = row.get("Image").toString();}catch(NullPointerException e){temp[1]="";}
				try{temp[2] = row.get("Name1").toString();}catch(NullPointerException e){temp[2]="";}
				try{temp[3] = row.get("Name2").toString();}catch(NullPointerException e){temp[3]="";}
				try{temp[4] = row.get("Team").toString();}catch(NullPointerException e){temp[4]="";}
				try{temp[5] = row.get("Order").toString();}catch(NullPointerException e){temp[5]="";}
				
				players.add(new LeaguePlayer(temp[0],temp[1],temp[2],temp[3],temp[4],temp[5]));
			}
			Collections.sort(players, new PlayerReferenceSortComparator());
		}catch(Exception e){JOptionPane.showMessageDialog(null, "Error somewhere loading student data.");return false;}
		return true;
	}
	public void next()
	{
		if(currentIndex<players.size()-1) currentIndex++;
		else currentIndex=0;
		current = players.get(currentIndex);
	}
	public void previous()
	{
		if(currentIndex>0) currentIndex--;
		else currentIndex=players.size()-1;
		current = players.get(currentIndex);
	}
	public int size()
	{
		return players.size();
	}
	public int getLastRefNum()
	{
		return Integer.parseInt(players.get(players.size()-1).ref);
	}
	public boolean addDuplicatePlayerImage(LeaguePlayer duplicate)
	{
		try
		{
			duplicate.ref = getLastRefNum()+1+"";
			table.addRow(duplicate.ref, duplicate.image,duplicate.name1,duplicate.name2,duplicate.team,duplicate.order);
			players.add(duplicate);

		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error adding to Table: "+e);return false;}
		return true;
	}
	public boolean addPlayer(ArrayList<LeaguePlayer> toAdd)
	{
		for(LeaguePlayer s:toAdd)
		{
			if(players.contains(s))
			{
				JOptionPane.showMessageDialog(null, "Reference number already exists! "+s.ref+" Will not update Database");
				return false;
			}
		}
		try
		{
			for(LeaguePlayer s:toAdd)
			{
				table.addRow(getLastRefNum()+1+"",s.image,s.name1,s.name2,s.team,s.order);
				players.add(s);
			}
		}catch(Exception e){JOptionPane.showMessageDialog(null,"Error adding to Table: "+e);return false;}
		return true;
	}
	public boolean savePlayer(LeaguePlayer s)
	{
		try
		{
			if(!players.contains(s))
			{
				table.addRow(Long.parseLong(players.get(players.size()-1).ref)+1,s.image,s.name1,s.name2,s.team,s.order);
				players.add(s);
				return true;
			}
			else
			{
				IndexCursor cursor = CursorBuilder.createCursor(table.getPrimaryKeyIndex());
				boolean found = cursor.findFirstRow(Collections.singletonMap("RefNum",s.ref));
				if(found)
				{
					cursor.updateCurrentRow(s.ref, s.image,s.name1,s.name2,s.team,s.order);
					for(LeaguePlayer play:players)
					{
						if(play.equals(s))
						{
							play = s;
							return true;
						}
					}
				}
			}
		}catch(Exception err){JOptionPane.showMessageDialog(null, "Fail! Unable to add/save missing LeaguePlayer: "+err);}
		return false;
	}
	public ArrayList<LeaguePlayer> getPlayers() {return new ArrayList<LeaguePlayer>(players);}
	public LeaguePlayer setCurrentPlayer(String ref)
	{
		for(int i=0;i<players.size();i++)
		{
			if(players.get(i).ref.equals(ref))
			{
				current = players.get(i);
				currentIndex = i;
				return current;
			}
		}
		JOptionPane.showMessageDialog(null, "Unable to set Current Player to: "+ref);
		return null;
	}
	public void close()
	{
		if(db!=null) try{db.close();db = null;}catch(Exception e){JOptionPane.showMessageDialog(null, "Error Cloing Player Database: "+e);}
	}
}
