FROM lambci/lambda:build-nodejs8.10

ENV PATH=/var/lang/bin:/usr/local/bin:/usr/bin/:/bin \
    LD_LIBRARY_PATH=/var/lang/lib:/lib64:/usr/lib64:/var/runtime:/var/runtime/lib:/var/task:/var/task/lib \
    AWS_EXECUTION_ENV=AWS_Lambda_nodejs8.10 \
    NODE_PATH=/var/runtime:/var/task:/var/runtime/node_modules \
		PROJ_VERSION=5.1.0 \
		GEOS_VERSION=3.6.2 \
		HDF4_VERSION=4.2.12 \
		SZIP_VERSION=2.1.1 \
		HDF5_VERSION=1.10.1 \
		NETCDF_VERSION=4.6.1 \
		OPENJPEG_VERSION=2.3.0 \
		PKGCONFIG_VERSION=0.29.2 \
		GDAL_VERSION=2.3.0 \
		BUILD=/tmp/vendored \
		PREFIX=/usr/local \
		GDAL_CONFIG=/usr/local/bin/gdal-config \
		LD_LIBRARY_PATH=/usr/local/lib:/usr/local/lib64

RUN \
    yum makecache fast; \
    yum install -y wget tar gcc zlib-devel zip libjpeg-devel rsync git ssh cmake \
    yum clean all;

WORKDIR /tmp/vendored

RUN wget https://download.osgeo.org/proj/proj-5.1.0.tar.gz; \
	tar -vxf proj-$PROJ_VERSION.tar.gz; \
	cd proj-$PROJ_VERSION; \
	./configure --prefix=$PREFIX; \
	make; \
	make install; \
	cd $BUILD; rm -rf proj-5.1.0

RUN wget http://download.osgeo.org/gdal/2.3.0/gdal-2.3.0.tar.gz; \
	tar -xvf gdal-2.3.0.tar.gz; \
	cd gdal-2.3.0; \
	./configure --with-proj=$PREFIX --with-threads --with-libtiff=internal --with-geotiff=internal --with-jpeg=internal --with-gif=internal --with-png=internal --with-libz=internal; \
	make; \
	make install; \
	cd $BUILD; rm -rf gdal-$GDAL_VERSION*

RUN	cd $BUILD; rm -rf proj-5.1.0; rm -rf gdal-$GDAL_VERSION;

RUN mkdir -p /tmp/vendored/lib

RUN cp /usr/local/lib/libgdal.so.20 /tmp/vendored/lib/
RUN cp /usr/local/lib/libproj.so.13 /tmp/vendored/lib/

RUN cp /usr/local/bin/ogr2ogr /tmp/vendored/lib/

RUN du -sh /tmp/vendored

COPY . /tmp/vendored/

RUN npm install

RUN du -sh /tmp/vendored

RUN cd /tmp/vendored && zip -r9q /tmp/package.zip *

# Cleanup
RUN rm -rf /tmp/vendored/
