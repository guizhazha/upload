def changeType(str):
    '''
    数据表Experi Type转换
    TYPE_CHOICES = (
		(0, "JV"),
        (1, "XRD"),
        (2, "IPCE"),
        (3, "PL"),
        (4, "ABS"),
    )
    '''
    
    TYPE_CHOICES = ['JV', 'XRD', 'IPCE', 'PL', 'ABS']
    num = TYPE_CHOICES.index(str)
    return num

