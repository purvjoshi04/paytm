FROM mongo:6.0.26
RUN echo "rs.initiate();" > /docker-entrypoint-initdb.d/replica-init.js
CMD [ "--replSet", "rs" ]
