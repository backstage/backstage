import{j as t,W as u,K as p,X as g}from"./iframe-B0Lf5NUM.js";import{r as h}from"./plugin-3g08vVoi.js";import{S as l,u as c,a as x}from"./useSearchModal-BwNtEDKs.js";import{s as S,M}from"./api-jCopdwY0.js";import{S as C}from"./SearchContext-lkMp76EX.js";import{B as m}from"./Button-BuRlNemE.js";import{m as f}from"./makeStyles-DeZCCiZz.js";import{D as j,a as y,b as B}from"./DialogTitle-p8BjwFdv.js";import{B as D}from"./Box-aMxsL92-.js";import{S as n}from"./Grid-DX6cOXg5.js";import{S as I}from"./SearchType-L91udPry.js";import{L as G}from"./List-H_vSxU0X.js";import{H as R}from"./DefaultResultListItem-CEiY94Y5.js";import{w as k}from"./appWrappers-Cb_SdAbw.js";import{SearchBar as v}from"./SearchBar-ClSONkLf.js";import{S as T}from"./SearchResult-gNR6JapA.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dwxxp7FQ.js";import"./Plugin-pnnQfLSu.js";import"./componentData-t2dFRqgI.js";import"./useAnalytics-CH2yDCbJ.js";import"./useApp-CqqROC9U.js";import"./useRouteRef-CBHK3ucf.js";import"./index-DKt6U3gJ.js";import"./ArrowForward-CH4KooK3.js";import"./translation-CIJmh7Of.js";import"./Page-BOXNd3d8.js";import"./useMediaQuery-zHphFWN7.js";import"./Divider-CK9FlrKj.js";import"./ArrowBackIos-C9q5wwIj.js";import"./ArrowForwardIos-BQC1_5Ez.js";import"./translation-CThOurOW.js";import"./lodash-DH4atvbO.js";import"./useAsync-jr_JLJU3.js";import"./useMountedState-DEhMjaJi.js";import"./Modal-Fw3H3BIv.js";import"./Portal-CFdZTsMU.js";import"./Backdrop-vQUEcbgu.js";import"./styled-DELPmjqg.js";import"./ExpandMore-Be3t2jaH.js";import"./AccordionDetails-DK-HjlUf.js";import"./index-B9sM2jn7.js";import"./Collapse-DTvR1_LU.js";import"./ListItem-Cm0Qqfxw.js";import"./ListContext-71Kb5fnr.js";import"./ListItemIcon-1atnPqzO.js";import"./ListItemText-by58IRV6.js";import"./Tabs-Ci3u_ATu.js";import"./KeyboardArrowRight-D92BH7zv.js";import"./FormLabel-DhAT4lSG.js";import"./formControlState-fwG5p3el.js";import"./InputLabel-CePXy9HT.js";import"./Select-DG060AKQ.js";import"./Popover-D7BDCpOw.js";import"./MenuItem-BagZeA1y.js";import"./Checkbox-DktdszXN.js";import"./SwitchBase-DYL-8-Ev.js";import"./Chip-CkXjccKJ.js";import"./Link-wi1rFsNT.js";import"./index-D2K6ALme.js";import"./useObservable-J6JZdQJK.js";import"./useIsomorphicLayoutEffect-D1wuUzNo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-D5RryG59.js";import"./useDebounce-Cox13PcB.js";import"./InputAdornment-CfGT-HGE.js";import"./TextField-qo5vTu5W.js";import"./useElementFilter-BRGzkF58.js";import"./EmptyState-D_YS_4s3.js";import"./Progress-ConcrlkH.js";import"./LinearProgress-CK26aZBG.js";import"./ResponseErrorPanel-CcOexGJ9.js";import"./ErrorPanel-C0qAmMXb.js";import"./WarningPanel-Cs3-YQda.js";import"./MarkdownContent-DIPhZmwJ.js";import"./CodeSnippet-hFxAGKUU.js";import"./CopyTextButton-DSxmlaRl.js";import"./useCopyToClipboard-CJWJqtNB.js";import"./Tooltip-BNHXTKw9.js";import"./Popper-Cw5KalTs.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>
  );
};
`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const CustomModal = () => {
  const classes = useStyles();
  const { state, toggleModal } = useSearchModal();

  return (
    <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => (
          <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs
                    defaultValue=""
                    types={[
                      {
                        value: "custom-result-item",
                        name: "Custom Item",
                      },
                      {
                        value: "no-custom-result-item",
                        name: "No Custom Item",
                      },
                    ]}
                  />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({ results }) => (
                      <List>
                        {results.map(({ document }) => (
                          <div
                            role="button"
                            tabIndex={0}
                            key={\`\${document.location}-btn\`}
                            onClick={toggleModal}
                            onKeyPress={toggleModal}
                          >
                            <DefaultResultListItem
                              key={document.location}
                              result={document}
                            />
                          </div>
                        ))}
                      </List>
                    )}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>
        )}
      </SearchModal>
    </>
  );
};
`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...e.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...r.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{r as CustomModal,e as Default,lo as __namedExportsOrder,io as default};
