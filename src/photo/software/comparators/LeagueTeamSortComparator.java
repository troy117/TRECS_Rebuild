package photo.software.comparators;

import java.util.Comparator;

import photo.software.league.LeaguePlayer;


public class LeagueTeamSortComparator  implements Comparator<LeaguePlayer>{
	public int compare(LeaguePlayer arg0, LeaguePlayer arg1)
	{
		if(arg0.team.compareTo(arg1.team)==0)
		{
			if(arg0.name1.compareTo(arg1.name1)==0)
			{
				if(arg0.name2.compareTo(arg1.name2)==0)	{ return arg0.ref.compareTo(arg1.ref);}
				return arg0.name2.compareTo(arg1.name2);
			}
			return arg0.name1.compareTo(arg1.name1);
		}
		return arg0.team.compareTo(arg1.team);
	}
}
