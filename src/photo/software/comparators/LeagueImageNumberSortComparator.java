package photo.software.comparators;

import java.util.Comparator;

import photo.software.league.LeaguePlayer;

public class LeagueImageNumberSortComparator implements Comparator<LeaguePlayer>{
	public int compare(LeaguePlayer arg0, LeaguePlayer arg1)
	{ 
		if(arg0.image.compareTo(arg1.image)==0)
		{
			return arg0.ref.compareTo(arg1.ref);
		}
		return arg0.image.compareTo(arg1.image);
	}
}
