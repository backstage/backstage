import{j as t,Z as u,N as p,$ as g}from"./iframe-ByRYLFwj.js";import{r as h}from"./plugin-1L4iWIKD.js";import{S as l,u as c,a as x}from"./useSearchModal-B9-i8X5j.js";import{s as S,M}from"./api-DGSwQaMr.js";import{S as C}from"./SearchContext-Cju87um5.js";import{B as m}from"./Button-COIfPx3h.js";import{m as f}from"./makeStyles-CUs-1deS.js";import{D as j,a as y,b as B}from"./DialogTitle-DzG7ce4f.js";import{B as D}from"./Box-D8ylNFTF.js";import{S as n}from"./Grid-BWBQHPmq.js";import{S as I}from"./SearchType-DeqkTX05.js";import{L as G}from"./List-D9mAo6Wj.js";import{H as R}from"./DefaultResultListItem-CUAFaKdI.js";import{w as k}from"./appWrappers-Bo3fcWYt.js";import{SearchBar as v}from"./SearchBar-DVvsE9iL.js";import{S as T}from"./SearchResult-CQg-RhSt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-57Ym0G5q.js";import"./Plugin-CSgcGvy-.js";import"./componentData-D5sreVVS.js";import"./useAnalytics-vZwzvm-y.js";import"./useApp-CVstOjrX.js";import"./useRouteRef-CRtctcru.js";import"./index-DsL-N0cf.js";import"./ArrowForward-DtwAvqur.js";import"./translation-Bzowmm3W.js";import"./Page-DLsZJ1zM.js";import"./useMediaQuery-Balm5x5n.js";import"./Divider-lv9ULMzF.js";import"./ArrowBackIos-Ck9MfR-Z.js";import"./ArrowForwardIos-oGCDY32R.js";import"./translation-Ck355kxs.js";import"./lodash-CEZ35LHP.js";import"./useAsync-BjbxvGBi.js";import"./useMountedState-0bFYrJyB.js";import"./Modal-CBQ1InMz.js";import"./Portal-BZPqZUv7.js";import"./Backdrop-DjTlyAU5.js";import"./styled-ASiGQwJu.js";import"./ExpandMore-BK_H-Jvj.js";import"./AccordionDetails-NtAlPKKr.js";import"./index-B9sM2jn7.js";import"./Collapse-Bm6s8njS.js";import"./ListItem-CRQYiEBH.js";import"./ListContext-Dqofe_r2.js";import"./ListItemIcon-DofZj1bW.js";import"./ListItemText-DWULtL2S.js";import"./Tabs-MlmV2HZt.js";import"./KeyboardArrowRight-BJMrPQKy.js";import"./FormLabel-Bt4QMASw.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BkI8melA.js";import"./InputLabel-oFTgcpXS.js";import"./Select-BJ4nCTvu.js";import"./Popover-DlGIOhka.js";import"./MenuItem-DblLrG1L.js";import"./Checkbox-oKImd3gz.js";import"./SwitchBase-CH87uAvf.js";import"./Chip-Dv3uOSNA.js";import"./Link-Bkh9f3bS.js";import"./index-BgENFDPt.js";import"./useObservable-Dq2pCwzc.js";import"./useIsomorphicLayoutEffect-BR76_7fo.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-D7D5MmD4.js";import"./useDebounce-CmT05tqH.js";import"./InputAdornment-QZnfETmc.js";import"./TextField-BIqLUFsX.js";import"./useElementFilter-DIHALuEd.js";import"./EmptyState-rWHiJgWG.js";import"./Progress-XrhtBng2.js";import"./LinearProgress-DS3BdZ7i.js";import"./ResponseErrorPanel-DOdxd3-l.js";import"./ErrorPanel-quplJSki.js";import"./WarningPanel-CNTjRA-n.js";import"./MarkdownContent-D2qK6LPH.js";import"./CodeSnippet-BCrFo6Kb.js";import"./CopyTextButton-CJbouSGI.js";import"./useCopyToClipboard-B6BCrc5N.js";import"./Tooltip-DR9Idexm.js";import"./Popper-BHEEGTZh.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},lo={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{r as CustomModal,e as Default,co as __namedExportsOrder,lo as default};
