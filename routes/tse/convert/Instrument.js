function full(data) {
	const InstrumentsArrStr = data.split(";");
	
	var Instruments = InstrumentsArrStr.map(i => {
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
	
	return {
		Instruments_Length: InstrumentsArrStr.length,
		Instruments,
	};
}

function names(data) {
	const InstrumentsArrStr = data.split(";");
	
	var Instruments = InstrumentsArrStr.map(i => {
		var row = i.split(",");
		return {
			Symbol: row[5],
			Name: row[6],
			LSoc30: row[10]
		};
	});
	
	return {
		Instruments_Length: InstrumentsArrStr.length,
		Instruments,
	};
}

module.exports = { full, names };