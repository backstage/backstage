import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-Bz1IoDwg.js";import{r as x}from"./plugin-BfTqc-z9.js";import{S as l,u as c,a as S}from"./useSearchModal-zx2kx-9I.js";import{s as M,M as C}from"./api-C7bd867L.js";import{S as f}from"./SearchContext-C8CvkHMd.js";import{B as m}from"./Button-CfSoEum0.js";import{D as j,a as y,b as B}from"./DialogTitle-DuwIaY1G.js";import{B as D}from"./Box-B4X1pSLD.js";import{S as n}from"./Grid-DSK0Sob8.js";import{S as I}from"./SearchType-DJNOGXPb.js";import{L as G}from"./List-BuBw1TsS.js";import{H as R}from"./DefaultResultListItem-ByS6pyHF.js";import{w as k}from"./appWrappers-BObMNmL2.js";import{SearchBar as v}from"./SearchBar-BXSZn7EG.js";import{S as T}from"./SearchResult-CuOZ-kq1.js";import"./preload-helper-PPVm8Dsz.js";import"./index-D04ZnlXx.js";import"./Plugin-CE0ZYiwI.js";import"./componentData-7nshGulq.js";import"./useAnalytics-CTEKxLAM.js";import"./useApp-PKPW6CfH.js";import"./useRouteRef-DtU3fdAe.js";import"./index-CrqMr4SR.js";import"./ArrowForward-e_qRJmu3.js";import"./translation-BwbNEZu8.js";import"./Page-8675TV-l.js";import"./useMediaQuery-C7p5dCds.js";import"./Divider-D1ZXem9_.js";import"./ArrowBackIos-C9Gai0Ef.js";import"./ArrowForwardIos-DBOx8-3N.js";import"./translation-DlgHUtHE.js";import"./lodash-Czox7iJy.js";import"./useAsync-m1QKb3St.js";import"./useMountedState-CBRaKuhZ.js";import"./Modal-Bl681vyA.js";import"./Portal-nnGdoBnk.js";import"./Backdrop-ealuYeba.js";import"./styled-nJYZvWBJ.js";import"./ExpandMore-Dlvt5b42.js";import"./AccordionDetails-qNBrrRUw.js";import"./index-B9sM2jn7.js";import"./Collapse-C7ZfnDjZ.js";import"./ListItem-DwPXYlNl.js";import"./ListContext-BU0MJFdF.js";import"./ListItemIcon-0sB19-tb.js";import"./ListItemText-uP05tp0v.js";import"./Tabs-C51JMFW6.js";import"./KeyboardArrowRight-jdX0x0BJ.js";import"./FormLabel-CUVPrL9m.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Jz7AGHC8.js";import"./InputLabel-7gbqHU_c.js";import"./Select-CNnQgqpb.js";import"./Popover-BW8B5BX3.js";import"./MenuItem-DO6FtSw3.js";import"./Checkbox-C0N9p44T.js";import"./SwitchBase-B-OZqFcT.js";import"./Chip-BEgkXSTh.js";import"./Link-BTTdXJ1E.js";import"./useObservable-DO4febub.js";import"./useIsomorphicLayoutEffect-BDov4fhP.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BJJ-Z38I.js";import"./useDebounce-lxf6JXt1.js";import"./InputAdornment-Bm-__BKS.js";import"./TextField-CN2wsWVt.js";import"./useElementFilter-C1CWEaXN.js";import"./EmptyState-CpnsiDQm.js";import"./Progress-QCehAyKS.js";import"./LinearProgress-Ct64K0jC.js";import"./ResponseErrorPanel-yUG-nvMh.js";import"./ErrorPanel-BtAfCzwR.js";import"./WarningPanel-Bny1Wix5.js";import"./MarkdownContent-DPlVt8XM.js";import"./CodeSnippet-BhvDpqOl.js";import"./CopyTextButton-B02pGVBs.js";import"./useCopyToClipboard-lsM1yAtv.js";import"./Tooltip-Dnn6Xi1p.js";import"./Popper-vOyuMRKf.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
}`,...r.parameters?.docs?.source}}};const io=["Default","CustomModal"];export{r as CustomModal,e as Default,io as __namedExportsOrder,so as default};
