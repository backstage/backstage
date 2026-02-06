import{j as t,U as u,m as p,K as g,a2 as h}from"./iframe-DPEQU9sg.js";import{r as x}from"./plugin-DfF1-kkE.js";import{S as l,u as c,a as S}from"./useSearchModal-CKCR3uCZ.js";import{s as M,M as C}from"./api-D1aB2rhI.js";import{S as f}from"./SearchContext-Dejq-K2O.js";import{B as m}from"./Button-B3E66A3B.js";import{D as j,a as y,b as B}from"./DialogTitle-8oe1SRUv.js";import{B as D}from"./Box-DFPXS1uh.js";import{S as n}from"./Grid-V2KC8DrR.js";import{S as I}from"./SearchType-BFt5YBZR.js";import{L as G}from"./List-DquDfnLJ.js";import{H as R}from"./DefaultResultListItem-D1EWy0Xn.js";import{w as k}from"./appWrappers-Bk2njHpK.js";import{SearchBar as v}from"./SearchBar-BMfVmZEE.js";import{S as T}from"./SearchResult-CAvFb1sq.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Dagz_pTm.js";import"./Plugin-Dd2xY8WF.js";import"./componentData-DiYtav-w.js";import"./useAnalytics-odk5YTGP.js";import"./useApp-WY7YhADn.js";import"./useRouteRef-PDyeC6uZ.js";import"./index-9w1oJKxU.js";import"./ArrowForward-B3AD257j.js";import"./translation-CuZh1wXG.js";import"./Page-B0Mxy1-P.js";import"./useMediaQuery-C3e1AJ83.js";import"./Divider-DubjQnze.js";import"./ArrowBackIos-BSP1TxON.js";import"./ArrowForwardIos-_13Utd0r.js";import"./translation-BfJviIKI.js";import"./lodash-Czox7iJy.js";import"./useAsync-BqETPqxv.js";import"./useMountedState-BqkaBMSv.js";import"./Modal-BY3dMB2D.js";import"./Portal-AonZoDqn.js";import"./Backdrop-BZwF8N70.js";import"./styled-_ZhQ2JBl.js";import"./ExpandMore-D_QIxzGY.js";import"./AccordionDetails-0XhIBkyu.js";import"./index-B9sM2jn7.js";import"./Collapse-ggEsDBaY.js";import"./ListItem-C3tAmyko.js";import"./ListContext-DyGfW3pa.js";import"./ListItemIcon-CypjUHeE.js";import"./ListItemText-xJVltyzR.js";import"./Tabs-C8uCoEJU.js";import"./KeyboardArrowRight-DlgM4IAa.js";import"./FormLabel-BUXwqQDg.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CnLv8su9.js";import"./InputLabel-DxGPQhnv.js";import"./Select-B-khT1R0.js";import"./Popover-CRfqc1ul.js";import"./MenuItem-DBga-0Jj.js";import"./Checkbox-BKZ14X1z.js";import"./SwitchBase-BaiV0qDQ.js";import"./Chip-BDOVbdu0.js";import"./Link-DnuEQx-0.js";import"./useObservable-Bl5WmSl_.js";import"./useIsomorphicLayoutEffect-8D8X83kR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BiX3XKaH.js";import"./useDebounce-CX9ADosI.js";import"./InputAdornment-BqmH1JSp.js";import"./TextField-DeCofTAY.js";import"./useElementFilter-CDIJo0HV.js";import"./EmptyState-D1m-gnLI.js";import"./Progress-CoLUHfH1.js";import"./LinearProgress-DN73H_Vz.js";import"./ResponseErrorPanel-BG9foovc.js";import"./ErrorPanel-Bv595yjm.js";import"./WarningPanel-C_F8xUzg.js";import"./MarkdownContent-D28GpyhI.js";import"./CodeSnippet-DGpkezw4.js";import"./CopyTextButton-CyVbES63.js";import"./useCopyToClipboard-D4G45ymZ.js";import"./Tooltip-1rkaBdpM.js";import"./Popper-BxGyCUHY.js";const b={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},so={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>k(t.jsx(u,{apis:[[M,new C(b)]],children:t.jsx(f,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})],tags:["!manifest"]},e=()=>{const{state:o,toggleModal:s}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:s,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:s})]})},N=p(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),r=()=>{const o=N(),{state:s,toggleModal:a}=c();return t.jsxs(t.Fragment,{children:[t.jsx(m,{variant:"contained",color:"primary",onClick:a,children:"Toggle Custom Search Modal"}),t.jsx(l,{...s,toggleModal:a,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(j,{children:t.jsxs(D,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(g,{"aria-label":"close",onClick:a,children:t.jsx(h,{})})]})}),t.jsx(y,{children:t.jsxs(n,{container:!0,direction:"column",children:[t.jsx(n,{item:!0,children:t.jsx(I.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(n,{item:!0,children:t.jsx(T,{children:({results:d})=>t.jsx(G,{children:d.map(({document:i})=>t.jsx("div",{role:"button",tabIndex:0,onClick:a,onKeyPress:a,children:t.jsx(R,{result:i},i.location)},`${i.location}-btn`))})})})]})}),t.jsx(B,{className:o.dialogActionsContainer,children:t.jsx(n,{container:!0,direction:"row",children:t.jsx(n,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};e.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{code:`const Default = () => {
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
