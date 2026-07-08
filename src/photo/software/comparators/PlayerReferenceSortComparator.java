package photo.software.comparators;

import java.util.Comparator;
import photo.software.league.LeaguePlayer;

public class PlayerReferenceSortComparator implements Comparator<LeaguePlayer>{
	public int compare(LeaguePlayer arg0, LeaguePlayer arg1){ return arg0.ref.compareTo(arg1.ref);}
}
