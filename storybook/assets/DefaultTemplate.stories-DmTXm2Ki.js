import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-Bnzrr9GJ.js";import{s as g,H as u}from"./plugin-DQnKwhQR.js";import{c as h}from"./api-CKgawEQD.js";import{c as f}from"./catalogApiMock-BzgbAzL6.js";import{s as x}from"./api-ACo5GBlt.js";import{S as y}from"./SearchContext-Ce_u_NY9.js";import{P as S}from"./Page-DYON6Qni.js";import{S as r}from"./Grid-yfENroGK.js";import{b as k,a as j,c as C}from"./plugin-DML38mmW.js";import{T as P}from"./TemplateBackstageLogo-uxxM3viP.js";import{T}from"./TemplateBackstageLogoIcon-D9-Dmhim.js";import{e as I}from"./routes-Bla2USqD.js";import{w as v}from"./appWrappers-VyQoo8wK.js";import{s as G}from"./StarredEntitiesApi-D0-pOJXV.js";import{M as A}from"./MockStarredEntitiesApi-5fLEhmFo.js";import{I as B}from"./InfoCard-B2jLnxg1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DjdzPMHD.js";import"./Plugin-D_YG91mq.js";import"./componentData-q9jR-RmB.js";import"./useAnalytics-0uTDec9U.js";import"./useApp-SixTcc6z.js";import"./useRouteRef-BIDrbivK.js";import"./index-CYC8aWCi.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-Cf2YmW8g.js";import"./useMountedState-BCp4s1hj.js";import"./DialogTitle-B57sbJyb.js";import"./Modal-C9035a_p.js";import"./Portal-7sPWK5aa.js";import"./Backdrop-U11n_nYY.js";import"./Button-C4wuUHK5.js";import"./useObservable-DuLbtCIZ.js";import"./useIsomorphicLayoutEffect-BBA0B-Gu.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CQJGZ3r6.js";import"./ErrorBoundary-DFuYykN9.js";import"./ErrorPanel-CD5X405H.js";import"./WarningPanel-CiGAMcSc.js";import"./ExpandMore-lB9NR-kr.js";import"./AccordionDetails-CuEuFzda.js";import"./index-B9sM2jn7.js";import"./Collapse-Bk6-UMMi.js";import"./MarkdownContent-uyUP_FU2.js";import"./CodeSnippet-CNEmId6n.js";import"./Box-_ldnD672.js";import"./styled-ECwvL4gF.js";import"./CopyTextButton-h_AlfJlB.js";import"./useCopyToClipboard-C1DHvlyv.js";import"./Tooltip-BNoXxCwH.js";import"./Popper-xM2ICnpy.js";import"./List-C5zGpaSP.js";import"./ListContext-BS9Mebja.js";import"./ListItem-WNmrdDGe.js";import"./ListItemText-CaCse6tD.js";import"./LinkButton-C4SkPNpD.js";import"./Link-B2CkVKPO.js";import"./CardHeader-D0WzuIfd.js";import"./Divider-Dygs3iK7.js";import"./CardActions-BwdKTwvs.js";import"./BottomLink-BBfeMbVs.js";import"./ArrowForward-KRJIM6Q4.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
