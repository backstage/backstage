import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-Bqhsa6Sh.js";import{s as g,H as u}from"./plugin-ByQXhup_.js";import{c as h}from"./api-SiahGf3H.js";import{c as f}from"./catalogApiMock-_sVZHe7_.js";import{s as x}from"./api-D4PYsrzF.js";import{S as y}from"./SearchContext-BS1y7RRC.js";import{P as S}from"./Page-DOhpmXw_.js";import{S as r}from"./Grid-B6o2V4N5.js";import{b as k,a as j,c as C}from"./plugin-BBZXZmo4.js";import{T as P}from"./TemplateBackstageLogo-CSn29H2p.js";import{T}from"./TemplateBackstageLogoIcon-_8YFuG67.js";import{e as I}from"./routes-D30BmTjH.js";import{w as v}from"./appWrappers-DpSGCgYr.js";import{s as G}from"./StarredEntitiesApi-DlnonxWH.js";import{M as A}from"./MockStarredEntitiesApi-bfT3GO7_.js";import{I as B}from"./InfoCard-DqQrAMvM.js";import"./preload-helper-D9Z9MdNV.js";import"./index-BnR6moq1.js";import"./Plugin-ChbcFySR.js";import"./componentData-BjQGtouP.js";import"./useAnalytics-V0sqNxHK.js";import"./useApp-DjjYoyBR.js";import"./useRouteRef-D2qGziGj.js";import"./index-C3od-xDV.js";import"./ref-C0VTUPuL.js";import"./lodash-CwBbdt2Q.js";import"./useAsync-CZ1-XOrU.js";import"./useMountedState-By8QTQnS.js";import"./DialogTitle-CWvQ0e48.js";import"./Modal-Bj_JGdVD.js";import"./Portal-C0qyniir.js";import"./Backdrop-jgSEnQhj.js";import"./Button-BIWqIjhL.js";import"./useObservable-CtpiA3_D.js";import"./useIsomorphicLayoutEffect-BBofhakA.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./CardContent-eJLTlWrs.js";import"./ErrorBoundary-qLv6qWws.js";import"./ErrorPanel-DjMQdfdJ.js";import"./WarningPanel-ChwZGoqa.js";import"./ExpandMore-DtBTikql.js";import"./AccordionDetails-TLAxJNrY.js";import"./index-DnL3XN75.js";import"./Collapse-BmcxTB9C.js";import"./MarkdownContent-NPwWt_6a.js";import"./CodeSnippet-668TY6_y.js";import"./Box-7oeyrs_b.js";import"./styled-PHRrol5o.js";import"./CopyTextButton-BbR5f8cw.js";import"./useCopyToClipboard-Cacc49O7.js";import"./Tooltip-BcEgbTA-.js";import"./Popper-CVY8x9L-.js";import"./List-DhlESJBF.js";import"./ListContext-42q0jwAr.js";import"./ListItem-BUcGiLuR.js";import"./ListItemText-CHn-6MvY.js";import"./LinkButton-xQ2OFSZK.js";import"./Link-BYO-u9Rv.js";import"./CardHeader-YTE5ohdi.js";import"./Divider-dXncAHZ6.js";import"./CardActions-CaoKmzIe.js";import"./BottomLink-Cq7vEnTL.js";import"./ArrowForward-o-fAnTPb.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
