a = '//aliexpress.ru/category/202002701/tool-sets.html'
sub = []
if a.find('category/') > 0:
    f_index = a.find('category/')
    l_index = a.rfind("/")
    print(f_index)
    print(l_index)
    cut = a[f_index+len('category/'):l_index]
    print(cut)