function full(data) {
	const { InstrumentsArrStr, SharesArrStr } = parse(data);
	
	var Instruments = InstrumentsArrStr.map(i => {
		// InstrumentInfo
		var row = i.split(",");
		return {
			InsCode      : row[0],  // int64
			InstrumentID : row[1],  // string
			LatinSymbol  : row[2],  // string
			LatinName    : row[3],  // string
			CompanyCode  : row[4],  // string
			Symbol       : row[5],  // string
			Name         : row[6],  // string
			CIsin        : row[7],  // string
			DEven        : row[8],  // int32
			Flow         : row[9],  // byte
			LSoc30       : row[10], // string
			CGdSVal      : row[11], // string
			CGrValCot    : row[12], // string
			YMarNSC      : row[13], // string
			CComVal      : row[14], // string
			CSecVal      : row[15], // string
			CSoSecVal    : row[16], // string
			YVal         : row[17]  // string
		};
	});
	
	var Shares = SharesArrStr.map(i => {
		// TseShareInfo
		var row = i.split(",");
		return {
			Idn              : row[0], // int64
			InsCode          : row[1], // int64
			DEven            : row[2], // int32
			NumberOfShareNew : row[3], // decimal
			NumberOfShareOld : row[4]  // decimal
		};
	});
	
	return {
		Instruments_Length: InstrumentsArrStr.length,
		Shares_Length: SharesArrStr.length,
		Instruments,
		Shares,
	};
}

function names(data) {
	const { InstrumentsArrStr, SharesArrStr } = parse(data);
	
	var Instruments = InstrumentsArrStr.map(i => {
		var row = i.split(",");
		return [ row[5], row[6], row[10] ]; // Symbol, Name, LSoc30
	});
	
	var Shares = SharesArrStr.map(i => i.split(",")[1]);
	
	return {
		Instruments_Length: InstrumentsArrStr.length,
		Shares_Length: SharesArrStr.length,
		Instruments,
		Shares,
	};
}

function parse(data) {
	var strFirstHalf = data.split("@")[0];
	var strSecondHalf = data.split("@")[1];
	var arrFirstHalf = strFirstHalf.split(";");
	var arrSecondHalf = strSecondHalf.split(";");
	
	if (strFirstHalf === "*") return false;
	return {
		InstrumentsArrStr: arrFirstHalf,
		SharesArrStr: arrSecondHalf
	};
}

module.exports = { full, names };