import{j as t,W as u,K as p,X as g}from"./iframe-DvAQ9TL9.js";import{r as h}from"./plugin-BcfO6x69.js";import{S as l,u as c,a as x}from"./useSearchModal-JxD_znsI.js";import{s as S,M}from"./api-Cew3V1iK.js";import{S as C}from"./SearchContext-Cf1zVBFd.js";import{B as m}from"./Button-CSzRzmAr.js";import{m as f}from"./makeStyles-DIoIr_Gz.js";import{D as j,a as y,b as B}from"./DialogTitle-CxCm8ZmH.js";import{B as D}from"./Box-DF8-c6JA.js";import{S as n}from"./Grid-R-6Q3RAr.js";import{S as I}from"./SearchType-BYJ2QK90.js";import{L as G}from"./List-JM-19v_p.js";import{H as R}from"./DefaultResultListItem-D5KtWdK8.js";import{w as k}from"./appWrappers-cPpGWhaa.js";import{SearchBar as v}from"./SearchBar-BF4BhrcY.js";import{S as T}from"./SearchResult-BrdMeTzQ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DyrGQo0S.js";import"./Plugin-DwgsGniV.js";import"./componentData-D5jAi7Lb.js";import"./useAnalytics-Dn-hivLl.js";import"./useApp-Ce7sGxgT.js";import"./useRouteRef-DX9Ct04B.js";import"./index-Bpd4QHCD.js";import"./ArrowForward-C9HgjYpy.js";import"./translation-CTWUDkHu.js";import"./Page-9jFNZKvk.js";import"./useMediaQuery-IguDvrLo.js";import"./Divider-Evup8xdO.js";import"./ArrowBackIos-CW9mooYq.js";import"./ArrowForwardIos-CXBsQpSP.js";import"./translation-SyWwsnZg.js";import"./lodash-BuTd1Mhz.js";import"./useAsync-BrqKzDbu.js";import"./useMountedState-CA4Rdt3V.js";import"./Modal-DIdrUuV4.js";import"./Portal-CZWMCv81.js";import"./Backdrop-CPHX8tkX.js";import"./styled-CoguSFmS.js";import"./ExpandMore-DvoBn6N_.js";import"./AccordionDetails-DY-ZFezw.js";import"./index-B9sM2jn7.js";import"./Collapse-B8ccB9dL.js";import"./ListItem-C50yNROG.js";import"./ListContext-C55nEgJD.js";import"./ListItemIcon-CTBtuD26.js";import"./ListItemText-BK-T--XP.js";import"./Tabs-Bjldskir.js";import"./KeyboardArrowRight-DKknhZ3I.js";import"./FormLabel-Dei6_5T2.js";import"./formControlState-DHZaSsu7.js";import"./InputLabel-BfgarOTS.js";import"./Select-DLNi-RIi.js";import"./Popover-CxJE2Piw.js";import"./MenuItem-DJZDCuxl.js";import"./Checkbox-C_6TM5fh.js";import"./SwitchBase-BiXXIbc-.js";import"./Chip-BAeWIvkp.js";import"./Link-Dtd7Q6IF.js";import"./index-D2kk_IGh.js";import"./useObservable-CCRlVb_e.js";import"./useIsomorphicLayoutEffect-FaLrxtUy.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-Bwh3GIjZ.js";import"./useDebounce-oqVFpeOB.js";import"./InputAdornment-C06uqTLC.js";import"./TextField-BUdQbDV8.js";import"./useElementFilter-DCvcSbuR.js";import"./EmptyState-CUBVDRBm.js";import"./Progress-BcyePviK.js";import"./LinearProgress-D9CzQhjs.js";import"./ResponseErrorPanel-Bxe7Hr62.js";import"./ErrorPanel-HBqbnSUL.js";import"./WarningPanel-Bxcykx1i.js";import"./MarkdownContent-FsJ6V0Ex.js";import"./CodeSnippet-Cw8HO4Ms.js";import"./CopyTextButton-BY3AYvWV.js";import"./useCopyToClipboard-CJ3bK8Wv.js";import"./Tooltip-Do0H6o91.js";import"./Popper-DAdC7LWr.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[S,new M(b)]],children:t.jsx(C,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":h}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=f(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(p,{"aria-label":"close",onClick:a,children:t.jsx(g,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
