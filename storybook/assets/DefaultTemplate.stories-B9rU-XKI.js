import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-BUNFJ-LL.js";import{s as g,H as u}from"./plugin-yKDzvPLF.js";import{c as h}from"./api-CmQYqdS2.js";import{c as f}from"./catalogApiMock-D-xX33M3.js";import{s as x}from"./api-BMyYV67s.js";import{S as y}from"./SearchContext-0ogBco_9.js";import{P as S}from"./Page-cSVZbdlw.js";import{S as r}from"./Grid-DBxLs0pG.js";import{b as k,a as j,c as C}from"./plugin-DfsIxsAq.js";import{T as P}from"./TemplateBackstageLogo-D6AU_moS.js";import{T}from"./TemplateBackstageLogoIcon-Y0viUP_x.js";import{e as I}from"./routes-8FNQv1Et.js";import{w as v}from"./appWrappers-DwaX-D8B.js";import{s as G}from"./StarredEntitiesApi-wbxkwSDc.js";import{M as A}from"./MockStarredEntitiesApi-Baz5WbBl.js";import{I as B}from"./InfoCard-OqQGZWM2.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BeHd8hJO.js";import"./Plugin-CX2F1Eyu.js";import"./componentData-zDZJvmdk.js";import"./useAnalytics-BrGJTKfU.js";import"./useApp-DBsIRrNl.js";import"./useRouteRef-DmkHHcok.js";import"./index-SSMRT9Bs.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-BJYhKhAw.js";import"./useMountedState-ykOrhzDb.js";import"./DialogTitle-hXdjHSFc.js";import"./Modal-Cwa9uuB3.js";import"./Portal-j32zjom2.js";import"./Backdrop-BXminUHH.js";import"./Button-D5VZkG9s.js";import"./useObservable-DQm2eMWh.js";import"./useIsomorphicLayoutEffect-CfM2gomt.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CxGOKSZj.js";import"./ErrorBoundary-D8c7Pies.js";import"./ErrorPanel-B1RREPgC.js";import"./WarningPanel-Ba3usJjp.js";import"./ExpandMore-BvmDc48x.js";import"./AccordionDetails-NEVFuKGX.js";import"./index-B9sM2jn7.js";import"./Collapse-oWd9G09k.js";import"./MarkdownContent-Baqdegrk.js";import"./CodeSnippet-BIdXEEly.js";import"./Box-E56LyC2U.js";import"./styled-BK7FZU9O.js";import"./CopyTextButton-Do76HFgY.js";import"./useCopyToClipboard-TXjlrrXP.js";import"./Tooltip-Cy4UhZnY.js";import"./Popper-Bi7zPSXU.js";import"./List-TXTv7s6H.js";import"./ListContext-DDohaQJk.js";import"./ListItem-DqtCuPtR.js";import"./ListItemText-Csz7vtMz.js";import"./LinkButton-k4dDLleo.js";import"./Link-9uhrDkOF.js";import"./CardHeader-CfmBdIWt.js";import"./Divider-CRo1EOKz.js";import"./CardActions-BfUIEmfS.js";import"./BottomLink-BlsmOo41.js";import"./ArrowForward-d_wnYzhM.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
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
