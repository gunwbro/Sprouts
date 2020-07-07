module.exports = (sequelize, DataTypes) => (
  sequelize.define('user', {
    email: {
      type: DataTypes.STRING(40),
      allowNull: true, // NULL 불가능하다는 뜻
      unique: true, // UNIQUE INDEX, 값이 고유해야 하는지에 대한 옵션
    },
    nick: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    provider: {                         //  local이면 로컬 로그인, kakao 면 카카오 로그인
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'local', // 기본 값
    },
    snsId: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
  }, {
    timestamps: true, // createdAt과 updatedAt 컬럼을 추가함
    paranoid: true, // deletedAt 컬럼을 추가함. 로우를 삭제하는 명령을 내렸을 때 로우를 제거하는 대신 제거된 날짜 입력
  })
);