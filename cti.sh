#!/bin/sh

npm run cti create './src/@seedwork/application' -- -i '*spec.ts' -b  &&
npm run cti create './src/@seedwork/domain' -- -i '*spec.ts' -e 'tests' -b &&
npm run cti create './src/@seedwork/infra' -- -i '*spec.ts' -b &&

npm run cti create './src/team-member/application' -- -i '*spec.ts' -b &&
npm run cti create './src/team-member/domain' -- -i '*spec.ts' -b &&
npm run cti create './src/team-member/infra' -- -i '*spec.ts' -b

